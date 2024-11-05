# SST

## 📦 Getting Started

### Prerequisites

- **Bun** runtime
- **AWS Account**: with [configured credentials](https://sst.dev/chapters/configure-the-aws-cli.html). [Create account](https://sst.dev/chapters/create-an-aws-account.html)
- **FFmpeg**: Installed and added to your PATH

## 📦 Getting Started

### Running the API without Docker

1. Navigate to the server directory:
   ```bash
   cd app/server-sst
   ```
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. Define your FFmpeg path in the `convert-queue-subscriber.py` file. Search for: `/opt/homebrew/bin/ffmpeg`
4. Start a dev stage with SST:
   ```bash
   npx sst dev
   ```
5. Look for the api and websocket endpoint in the terminal output and use it to interact with the API.