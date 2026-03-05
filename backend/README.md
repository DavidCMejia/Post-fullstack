# Fullstack Challenge — Backend

REST API built with **Express + TypeScript + TypeORM + PostgreSQL**.

---

## Tech Stack

- Node.js + Express
- TypeScript
- TypeORM
- PostgreSQL
- Zod (validation)
- JWT (authentication)
- Docker + Docker Compose

---

## Project Structure

```
src/
├── config/             # Database connection (TypeORM DataSource)
├── entities/           # TypeORM entities (SavedUser, Post)
├── middlewares/        # Auth guard, centralized error handler
├── modules/
│   ├── auth/           # Login — validator, service, controller, routes
│   ├── users/          # Users — repository, service, controller, routes
│   └── posts/          # Posts — validator, repository, service, controller, routes
├── tests/
│   └── unit/           # Unit tests (Jest)
├── app.ts              # Express app setup
└── index.ts            # Entry point — DB init + server start
```

---

## Requirements

- Node.js >= 18
- Yarn
- Docker + Docker Compose

---

## Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd backend

# Install dependencies
yarn

# Copy environment variables
cp .env.example .env
```

---

## Environment Variables

| Variable        | Description                          | Default                  |
|-----------------|--------------------------------------|--------------------------|
| `PORT`          | Server port                          | `4000`                   |
| `NODE_ENV`      | Environment                          | `development`            |
| `DB_HOST`       | PostgreSQL host                      | `localhost`              |
| `DB_PORT`       | PostgreSQL port                      | `5432`                   |
| `DB_USERNAME`   | PostgreSQL user                      | `postgres`               |
| `DB_PASSWORD`   | PostgreSQL password                  | `postgres`               |
| `DB_NAME`       | PostgreSQL database name             | `fullstack_challenge`    |
| `JWT_SECRET`    | Secret key for signing JWT tokens    | —                        |
| `JWT_EXPIRES_IN`| JWT expiration time                  | `24h`                    |
| `REQRES_BASE_URL`| ReqRes API base URL                 | `https://reqres.in/api`  |
| `CORS_ORIGIN`   | Allowed CORS origin                  | `http://localhost:3000`  |

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## Running Locally

### 1. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

> If port `5432` is already in use by another local Postgres instance, change the left side of the port mapping in `docker-compose.yml` and update `DB_PORT` in your `.env` accordingly:
> ```yaml
> ports:
>   - '5435:5432'
> ```

### 2. Create the database

```bash
docker exec -it fullstack_postgres psql -U postgres -c "CREATE DATABASE fullstack_challenge;"
```

> Alternatively you can do this visually via pgAdmin at `http://localhost:5050` (login: `admin@admin.com` / `admin`).

### 3. Start the development server

```bash
yarn dev
```

The server watches for file changes automatically via `ts-node-dev`.

Expected output:
```
✅ Database connected
🚀 Server running on http://localhost:4000
```

> In `development` mode, TypeORM runs with `synchronize: true` — tables are created automatically on startup. No manual migrations needed locally.

### 3. Verify the server is running

```
GET http://localhost:4000/health
```

---

## API Endpoints

All endpoints except `/auth/login` require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint       | Description              | Auth required |
|--------|----------------|--------------------------|---------------|
| POST   | /auth/login    | Login via ReqRes API     | No            |

**Request body:**
```json
{
  "email": "eve.holt@reqres.in",
  "password": "cityslicka"
}
```

**Response:**
```json
{
  "token": "<jwt_token>"
}
```

---

### Users

| Method | Endpoint              | Description                        | Auth required |
|--------|-----------------------|------------------------------------|---------------|
| POST   | /users/import/:id     | Fetch user from ReqRes and save to DB | Yes        |
| GET    | /users/saved          | List all locally saved users       | Yes           |
| GET    | /users/saved/:id      | Get a single saved user            | Yes           |
| DELETE | /users/saved/:id      | Delete a saved user                | Yes           |

---

### Posts

| Method | Endpoint      | Description              | Auth required |
|--------|---------------|--------------------------|---------------|
| GET    | /posts        | List posts (paginated)   | Yes           |
| GET    | /posts/:id    | Get a single post        | Yes           |
| POST   | /posts        | Create a post            | Yes           |
| PUT    | /posts/:id    | Update a post            | Yes           |
| DELETE | /posts/:id    | Delete a post            | Yes           |

**Pagination query params:** `?page=1&limit=10`

**Create/Update post body:**
```json
{
  "title": "My post title",
  "content": "Post body content here",
  "authorUserId": 1
}
```

---

## Running Tests

```bash
yarn test
```

Tests are located in `src/tests/unit/` and cover:

- `auth.service.test.ts` — login success, invalid credentials, service unavailable
- `auth.middleware.test.ts` — valid token, missing token, invalid token
- `post.service.test.ts` — paginated list, 404 on missing post, create post

---

## Deployment (AWS Lambda)

The backend is deployed on **AWS Lambda** via the [Serverless Framework](https://www.serverless.com/).

### Prerequisites

```bash
npm install -g serverless
```

### Deploy

```bash
# Configure AWS credentials
aws configure

# Deploy to AWS
serverless deploy
```

The API Gateway endpoint URL will be printed after a successful deploy.

> Make sure to set all environment variables as Lambda environment variables or via AWS Secrets Manager before deploying.

---

## Notes

- ReqRes (`https://reqres.in/api`) is used as an external mock service for authentication and user data.
- The login flow delegates credential validation to ReqRes and wraps the result in a local JWT.
- Posts are stored entirely in your local PostgreSQL database.
- Users are imported from ReqRes on demand and persisted locally.