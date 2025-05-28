# Payroll Management System

A comprehensive multi-branch payroll management system built with Next.js and NestJS.

## Project Structure

```
payroll-app/
├── payroll-backend/     # NestJS backend
└── payroll-frontend/    # Next.js frontend
```

## Environment Setup

### Backend (.env)

Create a `.env` file in the `payroll-backend` directory with the following variables:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=payroll_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=1d

# LDAP
LDAP_URL=ldap://localhost:389
LDAP_BASE_DN=dc=example,dc=com
LDAP_BIND_DN=cn=admin,dc=example,dc=com
LDAP_BIND_CREDENTIALS=admin_password

# Redis (for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env.local)

Create a `.env.local` file in the `payroll-frontend` directory with the following variables:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_AUTH_TYPE=ldap
```

## Development Setup

1. Install dependencies:

```bash
# Backend
cd payroll-backend
npm install

# Frontend
cd payroll-frontend
npm install
```

2. Start development servers:

```bash
# Backend
cd payroll-backend
npm run start:dev

# Frontend
cd payroll-frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

## Features

- Multi-branch payroll management
- LDAP authentication
- Role-based access control
- Attendance tracking
- Salary calculation
- Payroll processing
- Reports and analytics
- Audit logging

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- LDAP Integration
- Bull Queue
- Swagger

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Chart.js
- Zustand
