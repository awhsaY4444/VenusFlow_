# VenusFlow – Multi-Tenant Task Management System

A full-stack task management platform designed to handle **multiple organizations with strict data isolation** and **role-based access control (RBAC)**.

---

## 🚀 Key Features

- **Multi-Tenant Isolation**
  Ensures users only access data within their organization using query-level tenant enforcement.

- **Role-Based Access Control (RBAC)**
  Fine-grained permissions (e.g., CREATE_TASK, DELETE_ANY) beyond basic role checks.

- **JWT Authentication**
  Secure login system with protected routes and token validation.

- **Task Management (CRUD)**
  Create, update, delete, and manage tasks with ownership rules.

- **Audit Logging**
  Tracks all important task changes with before/after state.

- **API Documentation**
  Interactive Swagger docs for easy testing and integration.

- **Dockerized Setup**
  Entire application runs with a single command using Docker Compose.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Security**: JWT, Bcrypt, Helmet
- **Validation**: Zod
- **Infrastructure**: Docker, Docker Compose

---

## 🏗️ Architecture Overview

- **Middleware Layer**
  Handles tenant injection, authentication, and RBAC enforcement.

- **Service Layer**
  Contains business logic for tasks, audit logs, and notifications.

- **Database Layer**
  Uses a tenant-aware query wrapper to ensure strict data isolation.

---

## 🚦 Getting Started

### Prerequisites
- Docker

---

### Run Locally (Docker)

```bash
git clone <your-repo-url>
cd VenusFlow
cp .env.example .env
docker compose up --build

### NOTE

⚠️ When running without Docker, replace `db` with `localhost` in DATABASE_URL