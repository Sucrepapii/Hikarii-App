# Hikarii — Radical Clarity in Tasks & Budgeting

[![CI Pipeline](https://github.com/Sucrepapii/Hikarii-App/actions/workflows/ci.yml/badge.svg)](https://github.com/Sucrepapii/Hikarii-App/actions/workflows/ci.yml)
[![Node Version](https://img.shields.io/badge/node-v22-blue.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-Vitest%20%7C%20Passing-brightgreen.svg)](vitest.config.ts)

**Hikarii** is a fullstack web application engineered for intentional productivity and financial mastery. It solves the fragmentation between task tracking and financial management by connecting every milestone directly to project budgets, augmented with Google Gemini AI task decomposition, Google Calendar bi-directional sync, BullMQ background queues, Stripe subscription billing, and enterprise observability via Sentry and Pino.

---

## 🏛️ System Architecture

Hikarii uses a clean, decoupled architecture with a modern React 18 single-page frontend and a resilient Node.js / Express backend with Prisma ORM and BullMQ background workers.

```mermaid
graph TD
    Client["React 18 / Vite Client\n(Tailwind CSS, Zustand, Recharts)"]
    API["Express REST API (Node 22)\n(Controllers, Services, Pino Logger)"]
    Prisma["Prisma ORM Client"]
    Postgres[("PostgreSQL Database\n(Users, Tasks, Budgets, Audits)")]
    Redis[("Redis Instance\n(BullMQ Background Queue)")]
    Workers["Background Workers\n(Reminders, Trial Expiration, Wraps)"]
    Gemini["Google Gemini AI API\n(Task Splitting & Scoper)"]
    GCal["Google Calendar API\n(Bi-Directional Event Sync)"]
    Stripe["Stripe API\n(Subscriptions & Webhooks)"]
    Resend["Resend API\n(Transactional Emails)"]
    Sentry["Sentry\n(Error Tracking & Profiling)"]

    Client -->|HTTPS / JSON REST| API
    API -->|Typed Queries| Prisma
    Prisma --> Postgres
    API -->|Dispatch Jobs| Redis
    Redis --> Workers
    Workers -->|DB Updates| Postgres
    API -->|Prompt & Parse| Gemini
    API -->|OAuth2 / Calendar Events| GCal
    API -->|Billing & Checkout| Stripe
    API -->|Dispatch Emails| Resend
    API -->|Traces & Exceptions| Sentry
    Client -->|Client Errors| Sentry
```

### Component Breakdown
- **Frontend Layer**: Built with React 18, Vite, TypeScript, and Tailwind CSS. State is managed via lightweight Zustand stores with optimistic UI updates. Form validations are strictly enforced through Zod schemas.
- **API & Middleware Layer**: Express application secured with Helmet, HTTP Parameter Pollution (HPP) protection, structured rate limiting, and CORS whitelist controls.
- **Service & Domain Layer**: Encapsulated services (`AdminService`, `email.service`, `google.calendar.service`, etc.) decouple business workflows and audit logging from transport controllers.
- **Logging & Observability**: High-throughput structured JSON logging powered by **Pino** (`server/src/config/logger.ts`) with Sentry distributed tracing across frontend and backend.
- **Background Jobs**: BullMQ and Redis handle automated task reminders, monthly wraps, and trial expiration workflows without blocking synchronous HTTP request threads.

---

## 🚀 Quick Start (Fresh Clone)

### 1. Prerequisites
- **Node.js**: `v22.x` or higher (verified on Node 22)
- **npm**: `v10.x` or higher
- **PostgreSQL**: Local instance or managed provider (e.g. Supabase)
- **Redis**: Local instance or container (for background jobs)

### 2. Clone & Install
```bash
git clone https://github.com/Sucrepapii/Hikarii-App.git
cd Hikarii-App

# Clean install all root and runtime dependencies
npm ci
```

### 3. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Populate the required environment variables in `.env`:
```env
PORT=5005
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hikarii_dev?schema=public"
JWT_SECRET="replace_with_a_secure_random_key_min_32_chars"
CLIENT_URL="http://localhost:5173"
VITE_API_URL="http://localhost:5005/api"
```

### 4. Database Setup
Generate the Prisma typed client and execute migrations:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
Launch both client and server development processes:
```bash
npm run dev
```
- Client interface: `http://localhost:5173`
- API server: `http://localhost:5005/api`

---

## 🧪 Testing Suite & Quality Checks

Hikarii enforces strict code quality and test coverage across controllers, services, and React components.

### Run Unit and Component Tests
```bash
npm test
```

### Run Tests with Full Coverage Report
```bash
npm run test:coverage
```

### Linting & Formatting
```bash
# Check code style and rules
npm run lint

# Automatically fix lint issues
npm run lint:fix

# Format files with Prettier
npm run format
```

### TypeScript Type Checking
```bash
npm run typecheck
```

---

## 🐳 Containerized Deployment (Docker)

Hikarii includes an enterprise multi-stage Dockerfile and Docker Compose configuration for one-command local reproduction:

### Run Full Stack with Docker Compose
```bash
docker compose up --build -d
```
This spins up:
- `hikarii-app`: Multi-stage production Node 22 Alpine container (port `5005`)
- `hikarii-postgres`: PostgreSQL 16 database with health check (port `5432`)
- `hikarii-redis`: Redis 7 alpine cache & job queue (port `6379`)

### Stop Containers
```bash
docker compose down
```

---

## ⚙️ Environment Variables Reference

All referenced environment variables in the codebase are documented in [`.env.example`](.env.example):

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend HTTP port | `5005` |
| `NODE_ENV` | Application environment | `development` / `production` |
| `CLIENT_URL` | Trusted frontend origins for CORS | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Signing secret for session tokens | `32+ character string` |
| `JWT_EXPIRES_IN` | JWT token lifespan | `7d` |
| `ADMIN_EMAIL` | Default administrator account | `admin@hikarii.org` |
| `GEMINI_API_KEY` | Google Gemini AI generative API key | `AIzaSy...` |
| `GOOGLE_CLIENT_ID` | OAuth2 client ID for Google Calendar | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth2 client secret for Google Calendar | `GOCSPX-...` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET`| Stripe webhook verification secret | `whsec_...` |
| `RESEND_API_KEY` | Resend API key for transactional email | `re_...` |
| `REDIS_URL` | Redis URI for BullMQ workers | `redis://localhost:6379` |
| `SENTRY_DSN` | Sentry DSN for backend observability | `https://...@sentry.io/...` |
| `VITE_SENTRY_DSN` | Sentry DSN for frontend observability | `https://...@sentry.io/...` |

---

## 🔄 CI/CD Pipeline

Automated checks run on every `push` and `pull_request` targeting `main` via [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
1. **Lint**: Enforces ESLint standards with zero errors across TypeScript and React source.
2. **Typecheck**: Verifies strict TypeScript compilation via `tsc --noEmit`.
3. **Test & Coverage**: Executes Vitest unit tests (admin controller, auth schemas, React components) and outputs coverage artifacts.
4. **Build**: Assembles frontend Vite assets and bundles the Node.js server with esbuild.

Automated dependency updates and security patches are managed via [Dependabot](.github/dependabot.yml).

---

## 🔒 Security Hygiene & Audit Standards
- **Zero Committed Secrets**: All secrets and credentials are read dynamically from runtime environments via `dotenv` and validated with typed schemas.
- **No Committed Build Bundles**: Bundled artifacts (`dist/`, `dist-server/`) are strictly ignored by `.gitignore`.
- **Audit Logging**: Sensitive admin actions (user creation, role modification, account suspension) are recorded in PostgreSQL audit logs with client IP tracking.
- **Typed Errors**: Uniform error handling using typed `AppError` subclasses.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
