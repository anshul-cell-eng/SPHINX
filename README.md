# NEXUS — Enterprise Operations Management Platform

> **Tagline:** Every incident. One command center. Faster resolution.  
> **Category:** B2B Multi-Tenant Enterprise SaaS  
> **Sprint:** Sprint 01 — Project Foundation

---

## 1. Overview & Architecture

NEXUS is an enterprise operations management platform engineered for mission-critical visibility, real-time incident orchestration, multi-tenant workforce management, and SLA compliance.

This repository is structured as a modular monolith monorepo powered by **npm workspaces**.

```text
NEXUS/
├── apps/
│   ├── web/               # Frontend Application (React 18 + Vite + TypeScript + Tailwind CSS)
│   └── api/               # Backend API Server (Node.js + Express + TypeScript + Prisma ORM)
├── packages/
│   └── contracts/         # Shared TypeScript contracts & Zod validation schemas
├── package.json           # Monorepo root orchestration
├── tsconfig.base.json     # Strict base TypeScript configuration
├── .gitignore
├── .env.example           # Centralized environment template
└── README.md
```

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query v5, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, Zod, CORS |
| **Contracts** | Shared Zod Schemas & Inferred TypeScript Types (`@nexus/contracts`) |
| **Database** | PostgreSQL (Supabase compatible) with Multi-Tenant Architecture |
| **Authentication** | Supabase Auth (Prepared for Sprint 02) |
| **Deployment** | Vercel (Frontend SPA), Render (Express API) |

---

## 3. Environment Configuration

Copy the root `.env.example` to `.env` (and create `.env` in `apps/api` and `apps/web` if needed):

```bash
cp .env.example .env
```

### Required Variables Reference

```env
# Database (PostgreSQL / Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase Auth, Storage & Realtime
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # SERVER-SIDE ONLY

# Server Configuration
NODE_ENV=development
API_PORT=4000
WEB_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:4000/api/v1
```

> **Security Rule:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend client code.

---

## 4. Local Development Quickstart

Ensure Node.js (>= 20.x) and npm (>= 10.x) are installed.

### 1. Install Dependencies
```powershell
npm install
```

### 2. Generate Prisma Client
```powershell
npm run prisma:generate
```

### 3. Build Shared Contracts
```powershell
npm run build:contracts
```

### 4. Start Development Mode (Full-Stack Concurrently)
```powershell
npm run dev
```

Or run services independently:

- **Backend API only (Port 4000):**
  ```powershell
  npm run dev:api
  ```
- **Frontend SPA only (Port 5173):**
  ```powershell
  npm run dev:web
  ```

---

## 5. Prisma & PostgreSQL Integration

The multi-tenant schema is defined in `apps/api/prisma/schema.prisma`. It establishes multi-tenant constraints for `Organization`, `User`, `Department`, `Incident`, `Asset`, and `AuditLog`.

### Connecting a Database and Running Migrations

Once your Supabase PostgreSQL instance credentials are set in `DATABASE_URL` and `DIRECT_URL`:

1. **Validate schema syntax:**
   ```powershell
   npx prisma validate --schema=apps/api/prisma/schema.prisma
   ```

2. **Generate the Prisma client:**
   ```powershell
   npm run prisma:generate
   ```

3. **Apply the initial database migration:**
   ```powershell
   npx prisma migrate dev --name init_multi_tenant_foundation --schema=apps/api/prisma/schema.prisma
   ```

---

## 6. Verification & Quality Assurance

Run the root validation commands:

```powershell
# Typecheck all workspaces under strict mode
npm run typecheck

# Production build for all workspaces
npm run build

# Run linting check
npm run lint

# Run test check
npm run test
```

---

## 7. Sprint Status

- **Sprint 01 (Foundation):** **COMPLETE** — Monorepo setup, shared contracts, Express backend, React frontend, live health handshake, Prisma PostgreSQL schema.
- **Sprint 02 (Authentication & Tenant Context):** Pending.
- **Sprint 03 (Workforce, Departments & Assets):** Pending.
- **Sprint 04 (Incident Operations & SLA Engine):** Pending.
- **Sprint 05 (Analytics & Command Center):** Pending.
