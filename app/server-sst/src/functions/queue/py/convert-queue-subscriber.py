import yt_dlp
import os
import logging
import json
import boto3
from boto3.dynamodb.types import TypeDeserializer
from datetime import datetime, timezone
from decimal import Decimal

S3_BUCKET               = os.environ['MEDIA_BUCKET_NAME']  # Get the S3 bucket name from the environment variables
S3_KEY                  = os.environ['MEDIA_BUCKET_KEY_PREFIX']  # Define the S3 key (path) for the uploaded file
CONVERT_JOB_TABLE_NAME  = os.environ['CONVERT_JOB_TABLE_NAME'] # Get the DynamoDB table name from the environment variables
CONNECTIONS_TABLE_NAME  = os.environ['WS_CONNECTIONS_TABLE_NAME'] # Get the DynamoDB table name from the environment variables
WS_API_ENDPOINT         = os.environ['WS_API_ENDPOINT'] # Get the WebSocket URL from the environment variables
IS_DEV                  = os.environ['SST_DEV']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
dynamodb_client = boto3.client('dynamodb')
apigateway_management_api = boto3.client('apigatewaymanagementapi', endpoint_url=WS_API_ENDPOINT)

def handler(event, context):
    print("Starting function execution")

    for record in event['Records']:
        message = record['body']
        process_message(message)

    return {
        "statusCode": 200,
        "body": "OK",
    }


def process_message(message):
    print(f"Processing message: {message}")
    data = json.loads(message)
    file_id = data['fileId']
    url = data['url']

    file_name = f'{file_id}.mp3'

    print(f"Downloading audio from {url}")
    print(f"Saving audio to {file_id}.mp3")

    try:
        download_mp3(url, file_id)
        upload_to_s3(file_name, file_id)
        status = 'completed'
    except Exception as e:
        print(f"An error occurred: {e}")
        status = 'failed'
    finally:
        updated_item = update_file_status(file_id, status)
        notify_client_convert_job_completed(file_id, updated_item)
        
        if os.path.exists(file_name):
            os.remove(file_name)

    print(f"Audio saved to S3: {file_id}.mp3")

def download_mp3(url, output_path='downloaded_audio.mp3'):
    """
    Download an audio file from YouTube URL.
    """
    ydl_opts = {
        'format': 'bestaudio/best', # Download best available audio quality
        'postprocessors': [
            {   # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }
        ],
        'outtmpl': output_path,
        'ffmpeg_location': IS_DEV == 'true' and '/opt/homebrew/bin/ffmpeg' or '/opt/bin/ffmpeg',
    }

    # Download audio
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def upload_to_s3(file_path, key):
    """
    Upload a file to an S3 bucket.
    """
    s3_client.upload_file(file_path, S3_BUCKET, S3_KEY + key + '.mp3')

# Convert Decimal to float before dumping to JSON
def convert_decimals(d):
    for key, value in d.items():
        if isinstance(value, Decimal):
            d[key] = float(value)
    return d

def update_file_status(file_id, status='completed'):
    """
    Update the status of the file in the DynamoDB table.
    """

    current_datetime = datetime.now(timezone.utc)

    # Format to ISO 8601 with milliseconds and "Z" for UTC
    formatted_datetime = current_datetime.isoformat(timespec='milliseconds').replace("+00:00", "Z")

    response = dynamodb_client.update_item(
        TableName=CONVERT_JOB_TABLE_NAME,
        Key={
            'fileId': {'S': file_id}
        },
        UpdateExpression='SET #status = :status, #finishedAt = :finishedAt',
        ExpressionAttributeNames={
            '#status': 'status',
            '#finishedAt': 'finishedAt'
        },
        ExpressionAttributeValues={
            ':status': {'S': status},
            ':finishedAt': {'S': formatted_datetime}
        },
        ReturnValues="ALL_NEW"
    )

    # Convert the DynamoDB structure to a normal Python dict
    deserializer = TypeDeserializer()
    updated_item = {k: deserializer.deserialize(v) for k, v in response.get("Attributes", {}).items()}

    return updated_item

def notify_client_convert_job_completed(file_id, updated_item_obj):
    """
    Notify the client that the convert job has been completed.
    """

    response = dynamodb_client.query(
        TableName=CONNECTIONS_TABLE_NAME,
        IndexName='fileIdIndex',
        KeyConditionExpression='fileId = :fileId',
        ExpressionAttributeValues={
            ':fileId': {'S': file_id}
        }
    )

    for item in response['Items']:
        connection_id = item['connectionId'].get('S')

        # Send a message to the client
        try:
            # Send the message to the WebSocket connection
            apigateway_management_api.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps(convert_decimals(updated_item_obj))  # Send message in a JSON format
            )
            print(f'Sent message to connection ID: {connection_id}')
        except Exception as e:
            print(f'Failed to send message to {connection_id}: {str(e)}')
