import { APIGatewayProxyResultV2 } from "aws-lambda";

export class ApiResponse {
  private statusCode: number = 200;
  private headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  private body: string;

  constructor(body: Object | string) {
    this.body = typeof body === "string" ? body : JSON.stringify(body, null, 2);
  }

  setStatus(status: number): this {
    this.statusCode = status;
    return this;
  }

  setHeaders(headers: { [key: string]: string }): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  valueOf(): APIGatewayProxyResultV2 {
    return {
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body,
    };
  }
}
