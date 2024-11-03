import yt_dlp
import os
import logging
import json
import boto3
from datetime import datetime, timezone

S3_BUCKET               = os.environ['MEDIA_BUCKET_NAME']  # Get the S3 bucket name from the environment variables
S3_KEY                  = os.environ['MEDIA_BUCKET_KEY_PREFIX']  # Define the S3 key (path) for the uploaded file
CONVERT_JOB_TABLE_NAME  = os.environ['CONVERT_JOB_TABLE_NAME'] # Get the DynamoDB table name from the environment variables
IS_PROD                 = os.environ['IS_PROD']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
dynamodb_client = boto3.client('dynamodb')

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
        os.remove(file_name)
        update_file_status(file_id, 'completed')
    except Exception as e:
        print(f"An error occurred: {e}")
        update_file_status(file_id, 'failed')

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
        'ffmpeg_location': IS_PROD == 'true' and '/opt/bin/ffmpeg' or '/opt/homebrew/bin/ffmpeg',
    }

    # Download audio
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def upload_to_s3(file_path, key):
    """
    Upload a file to an S3 bucket.
    """
    s3_client.upload_file(file_path, S3_BUCKET, S3_KEY + key + '.mp3')

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
        ReturnValues="UPDATED_NEW"
    )

    return response