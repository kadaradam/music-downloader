# Elysia with Bun runtime

## 📦 Getting Started

### Prerequisites

- **Bun** runtime
- **RabbitMQ** installed and running
- **PostgreSQL** installed and running
- **Docker** (optional): Easiest way to run the app. Saves you from setting up RabbitMQ and PostgreSQL.

## 📦 Getting Started

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

Open http://localhost:3000/ with your browser to see the result.