<div align="center">

# ⚡ VenusFlow

### Enterprise-Grade Multi-Tenant Task Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-venus--flow--client.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://venus-flow-client.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85ea2d?style=for-the-badge&logo=swagger&logoColor=black)](https://venusflow-api.onrender.com/api-docs)
[![Backend](https://img.shields.io/badge/Backend-Render-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://venusflow-api.onrender.com)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

*A production-deployed, full-stack SaaS platform built for organizations that need strict data isolation, fine-grained access control, and a clean, scalable architecture.*

</div>

---

## 🌐 Live Production Links

| Service | URL |
|---|---|
| 🖥️ **Frontend (Vercel)** | [venus-flow-client.vercel.app](https://venus-flow-client.vercel.app) |
| ⚙️ **Backend API (Render)** | [venusflow-api.onrender.com](https://venusflow-api.onrender.com) |
| 📖 **Swagger API Docs** | [venusflow-api.onrender.com/api-docs](https://venusflow-api.onrender.com/api-docs) |
| 🗄️ **Database** | Neon PostgreSQL — managed serverless cloud |

---

## 🚀 Key Features

### 🏢 Multi-Tenant Architecture
Every organization's data is fully isolated at the **query level** — not just filtered in memory. A tenant context is injected at the middleware layer and propagated through every database call, making cross-tenant data leaks structurally impossible.

### 🛡️ Role-Based Access Control (RBAC)
Permissions go beyond simple `admin / member` roles. Fine-grained permission constants (`CREATE_TASK`, `DELETE_ANY`, `MANAGE_MEMBERS`) are enforced at both the API and UI layers, so the interface only shows what a user is actually allowed to do.

### 🔐 JWT Authentication
Stateless, secure authentication with signed JWTs, protected API routes, password hashing with Bcrypt (12 rounds), and HTTP headers hardened via Helmet.

### ✅ Task Management (Full CRUD)
Create, assign, update, and delete tasks with priority levels (High / Medium / Low), status tracking (Todo / In Progress / Done), and ownership rules enforced at the API level.

### 📋 Audit Logging
Every significant task change is recorded with actor identity, timestamp, and before/after state snapshots — visible in the live activity feed.

### 📖 Interactive API Documentation
Swagger UI deployed alongside the API — explore and test every endpoint directly in the browser without Postman.

### 🐳 Dockerized Local Setup
The entire stack (API + PostgreSQL) spins up with a single command using Docker Compose.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Neon — serverless cloud) |
| **Auth** | JWT, Bcrypt |
| **Security** | Helmet, CORS, Zod validation |
| **Docs** | Swagger / OpenAPI 3.0 |
| **Infrastructure** | Docker, Docker Compose |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   React Frontend                     │
│           (Vite · Tailwind · React Router)            │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼───────────────────────────────┐
│                 Express API Server                   │
│  ┌─────────────────────────────────────────────┐    │
│  │             Middleware Layer                 │    │
│  │   JWT Auth → Tenant Injection → RBAC Guard   │    │
│  └──────────────────┬──────────────────────────┘    │
│  ┌──────────────────▼──────────────────────────┐    │
│  │              Service Layer                   │    │
│  │   Tasks · Audit Logs · Invitations · Auth    │    │
│  └──────────────────┬──────────────────────────┘    │
│  ┌──────────────────▼──────────────────────────┐    │
│  │          Tenant-Aware DB Layer               │    │
│  │   Every query scoped to organization_id      │    │
│  └──────────────────┬──────────────────────────┘    │
└──────────────────────┼───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│             PostgreSQL (Neon Cloud)                  │
└──────────────────────────────────────────────────────┘
```

---

## 🚦 Getting Started

### Option 1 — Use the Live App *(No setup required)*

**👉 [venus-flow-client.vercel.app](https://venus-flow-client.vercel.app)**

Register a new workspace, invite team members, and start managing tasks instantly.

---

### Option 2 — Run Locally with Docker

**Prerequisites:** Docker Desktop installed

```bash
git clone https://github.com/awhsaY4444/VenusFlow_.git
cd VenusFlow
cp .env.example .env
docker compose up --build
```

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api-docs |

---

### Option 3 — Run Locally without Docker

**Prerequisites:** Node.js 18+, PostgreSQL running locally

```bash
git clone https://github.com/awhsaY4444/VenusFlow_.git
cd VenusFlow
npm install

# In .env: change DATABASE_URL host from 'db' to 'localhost'
cp .env.example .env

npm run migrate --workspace server

# Start in two terminals:
npm run dev:server    # API → http://localhost:4000
npm run dev:client    # UI  → http://localhost:5173
```

---

## 🔑 Environment Variables

```env
PORT=4000
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/venusflow
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
SMTP_HOST=smtp.gmail.com
SMTP_FROM="VenusFlow" <your-gmail@gmail.com>
```

> For production: set `NODE_ENV=production` and update `CLIENT_URL` to your deployed frontend URL.

---

## 📁 Project Structure

```
VenusFlow/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── features/        # Feature modules (tasks, team, analytics...)
│   │   ├── components/      # Shared UI components
│   │   ├── contexts/        # Auth & Toast context
│   │   ├── layout/          # AppShell, Sidebar, Topbar
│   │   └── pages/           # Settings, Profile
│   └── vercel.json          # SPA routing config
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/       # Auth, RBAC, tenant injection
│   │   ├── routes/          # API route definitions
│   │   └── migrations/      # SQL schema migrations
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── SCALING.md
```

---

## 📬 API Overview

Full interactive docs at **[/api-docs](https://venusflow-api.onrender.com/api-docs)**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create organization + admin account |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/tasks` | List all tasks for the tenant |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task (ownership enforced) |
| `GET` | `/api/users` | List workspace members |
| `POST` | `/api/invite` | Invite a new member (admin only) |
| `GET` | `/api/audit` | Fetch workspace audit log |
| `GET` | `/api/analytics` | Task analytics and breakdown |

---

## 🔒 Security Highlights

- All routes protected by JWT middleware — unauthenticated requests return `401`
- Every DB query scoped to `organization_id` — tenants cannot access each other's data
- RBAC middleware blocks unauthorized actions before reaching the service layer
- Bcrypt password hashing (cost factor 12)
- HTTP headers hardened with Helmet
- Input validated with Zod schemas at every API boundary

---

## 📄 License

MIT — free to use, fork, and build upon.

---

<div align="center">
  Built with ❤️ by <strong>Yashwanthi</strong><br/>
  <a href="https://venus-flow-client.vercel.app">Live App</a> ·
  <a href="https://venusflow-api.onrender.com/api-docs">API Docs</a> ·
  <a href="https://github.com/awhsaY4444/VenusFlow_">GitHub</a>
</div>
