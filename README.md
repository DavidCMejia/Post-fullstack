# Fullstack Challenge — Users & Posts

Full-stack application built with **Next.js + Express + TypeScript + PostgreSQL**.

---

## Monorepo Structure

```
AAA Users & Posts/
├── backend/       # Express REST API
├── front/         # Next.js frontend
└── README.md
```

---

## Tech Stack

**Frontend**
- Next.js 13 (Pages Router)
- TypeScript
- Redux Toolkit
- Ant Design
- Axios
- Jest + React Testing Library

**Backend**
- Express + TypeScript
- TypeORM + PostgreSQL
- Zod (validation)
- JWT (authentication)
- Docker + Docker Compose
- Jest (unit tests)

---

## Requirements

- Node.js >= 18
- Yarn
- Docker + Docker Compose

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd "AAA Users & Posts"
```

---

## Backend Setup

```bash
cd backend
yarn
cp .env.example .env
```

### Environment Variables

| Variable          | Description                        | Default                 |
|-------------------|------------------------------------|-------------------------|
| `PORT`            | Server port                        | `4000`                  |
| `DB_HOST`         | PostgreSQL host                    | `localhost`             |
| `DB_PORT`         | PostgreSQL port                    | `5432`                  |
| `DB_USERNAME`     | PostgreSQL user                    | `postgres`              |
| `DB_PASSWORD`     | PostgreSQL password                | `postgres`              |
| `DB_NAME`         | Database name                      | `fullstack_challenge`   |
| `JWT_SECRET`      | Secret key for JWT signing         | —                       |
| `REQRES_BASE_URL` | ReqRes API base URL                | `https://reqres.in/api` |
| `CORS_ORIGIN`     | Allowed CORS origin                | `http://localhost:3000` |

### Start PostgreSQL

```bash
docker-compose up -d
```

> If port `5432` is in use, change the mapping in `docker-compose.yml` to `5435:5432` and update `DB_PORT` in `.env`.

### Create the database

```bash
docker exec -it fullstack_postgres psql -U postgres -c "CREATE DATABASE fullstack_challenge;"
```

### Seed (optional)

```bash
yarn seed
```

Creates 3 sample users and 3 sample posts.

### Start the server

```bash
yarn dev
```

Expected output:
```
✅ Database connected
🚀 Server running on http://localhost:4000
```

### Run backend tests

```bash
yarn test
```

Covers: auth service, auth middleware, post service.

---

## Frontend Setup

```bash
cd front
yarn
```

Create `.env.local` in the `front/` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000
```

### Start the frontend

```bash
yarn dev
```

Opens at `http://localhost:3000`.

On startup, the console will show:
```
✅ Backend connected — http://localhost:4000
```

### Run frontend tests

```bash
yarn test
```

Covers: Login page rendering, error handling, redirect on success, Users list rendering, client-side search filtering.

---

## API Endpoints

All endpoints except `POST /auth/login` require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint      | Auth | Description           |
|--------|---------------|------|-----------------------|
| POST   | /auth/login   | No   | Login, returns JWT    |

```json
{ "email": "eve.holt@reqres.in", "password": "cityslicka" }
```

### Users

| Method | Endpoint            | Auth | Description                      |
|--------|---------------------|------|----------------------------------|
| GET    | /users/reqres       | Yes  | List users from ReqRes (paged)   |
| GET    | /users/reqres/:id   | Yes  | Get single ReqRes user           |
| POST   | /users/import/:id   | Yes  | Import user from ReqRes to DB    |
| GET    | /users/saved        | Yes  | List locally saved users         |
| GET    | /users/saved/:id    | Yes  | Get single saved user            |
| DELETE | /users/saved/:id    | Yes  | Delete saved user                |

### Posts

| Method | Endpoint    | Auth | Description              |
|--------|-------------|------|--------------------------|
| GET    | /posts      | Yes  | List posts (paginated)   |
| GET    | /posts/:id  | Yes  | Get single post          |
| POST   | /posts      | Yes  | Create post              |
| PUT    | /posts/:id  | Yes  | Update post              |
| DELETE | /posts/:id  | Yes  | Delete post              |

**Pagination:** `?page=1&limit=10`

---

## Authentication Flow

```
Browser → POST /api/auth/login (Next.js API route)
              ↓
         POST http://localhost:4000/auth/login (Express)
              ↓
         Express validates credentials
              ↓
         Returns JWT → stored in httpOnly cookie + localStorage
              ↓
         Next.js middleware protects /dashboard, /users, /posts
         Express middleware protects all API routes
```

---

## ⚠️ Note on ReqRes Availability

ReqRes (`https://reqres.in`) is protected by Cloudflare, which blocks server-side HTTP requests from Node.js with a `403 Forbidden` response.

**Solution implemented:** Both the auth service and user service attempt to reach ReqRes first. If Cloudflare blocks the request, they fall back to local validation using the known ReqRes credentials and user data, maintaining identical behavior.

Valid credentials (same as ReqRes docs):
- `eve.holt@reqres.in` / `cityslicka`
- `charles.morris@reqres.in` / `pistol`
- `peter.fields@reqres.in` / `marko`

If ReqRes becomes accessible in a different network or deployment environment, the integration works transparently without any code changes.

---

## Deployment (AWS Lambda)

The backend is deployed on AWS Lambda via the Serverless Framework.

**Live backend URL:**
```
https://x8ljuoyfr0.execute-api.us-east-1.amazonaws.com
```

### Prerequisites

```bash
npm install -g serverless
aws configure  # requires AWS Access Key ID and Secret
```

### Deploy

```bash
cd backend
yarn deploy
```

This compiles TypeScript and deploys to AWS Lambda + API Gateway automatically.

### Remove deployment

```bash
cd backend
serverless remove
```

### Production database

Production uses **Supabase** (PostgreSQL). Set the following environment variables before deploying:

| Variable       | Description              |
|----------------|--------------------------|
| `DB_HOST_PROD` | Supabase host            |
| `DB_PORT_PROD` | Supabase port (5432)     |
| `DB_USERNAME_PROD` | Supabase user        |
| `DB_PASSWORD_PROD` | Supabase password    |
| `DB_NAME_PROD` | Supabase database name   |
| `JWT_SECRET`   | JWT signing secret       |

---

## API Documentation (Swagger)

The backend exposes an interactive Swagger UI at:

```
http://localhost:4000/api-docs
```

Production Swagger:
```
https://x8ljuoyfr0.execute-api.us-east-1.amazonaws.com/api-docs
```

The raw OpenAPI spec is available at:
```
http://localhost:4000/api-docs.json
```

The frontend also includes an embedded **API Docs** page accessible from the sidebar at `http://localhost:3000/docs`.

### How to test authenticated endpoints in Swagger

1. Open `http://localhost:4000/api-docs`
2. Call `POST /auth/login` with valid credentials
3. Copy the `token` from the response
4. Click the **Authorize** button (top right)
5. Paste the token and click **Authorize**
6. All protected endpoints are now unlocked
