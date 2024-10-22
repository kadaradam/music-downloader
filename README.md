# 🎶 YouTube Music Downloader

Easily download your favorite music from YouTube with blazing speed and real-time feedback! Built with **Bun**, **ElysiaJs**, **RabbitMQ**, **Drizzle ORM**, **Next.js**, **ShadCN**, and **WebSockets**, this app delivers a seamless and modern experience.

<p align="center">
   <img src="./assets/preview_home.png" alt="Home Screen" width="320px"/>
</p>
<p align="center">
   <img src="./assets/preview_job_completed.png" alt="Convert Completed Successfully" width="320px"/>
</p>
<p align="center">
   <img src="./assets//preview_job_archived.png" alt="Audio file archived" width="320px"/>
</p>

## 🚀 Features

- **Real-Time Updates**: Track download progress via WebSockets.
- **Task Queuing**: Reliable background processing with RabbitMQ.
- **Database Management**: Powered by Drizzle ORM for a flexible and efficient database layer.
- **Modern UI**: Built with Next.js and ShadCN for a smooth user experience.

## 🛠️ Tech Stack

- **Bun**: High-performance runtime.
- **ElysiaJs**: Lightweight API framework.
- **RabbitMQ**: Task queuing for downloads.
- **Drizzle ORM**: Type-safe SQL database management.
- **Next.js & ShadCN**: Modern frontend.
- **WebSockets**: Real-time communication.

## 📦 Getting Started

### Prerequisites

- **Bun** runtime
- **RabbitMQ** installed and running
- **PostgreSQL** installed and running
- **Docker** (optional): Easiest way to run the app. Saves you from setting up RabbitMQ and PostgreSQL.

## 📦 Getting Started

## 🗺 API

### Running the API without Docker

1. Navigate to the server directory:
   ```bash
   cd app/server
   ```
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. Copy the `.env.example` file and configure your environment:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
    bun run dev
   ```

### Running the API with Docker

1. Copy the `.env.example` file and configure your environment:
   ```bash
    cp .env.example .env
   ```
2. Start the server:
   ```bash
    docker-compose up
   ```

### Migrating the Database

1. Run the migrations:
   ```bash
   bun run db:migrate
   ```

#### Drizzle Studio (Tool):

Drizzle comes with **Drizzle Studio**, a built-in web-based interface to browse and manage your database.

Run the following command to start Drizzle Studio:

```bash
bun run drizzle-kit studio
```

---

### 💻 Frontend

1. Navigate to the client directory:
   ```bash
   cd app/client
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy the `.env.example` file and configure your environment:
   ```bash
    cp .env.example .env.local
   ```
4. Start the client:
   ```bash
    bun run dev
   ```

Enjoy your music! 🎧
