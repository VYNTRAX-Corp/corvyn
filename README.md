# Corvyn

Corvyn is a privacy-first platform for reporting threats to people and society.
The current repository contains the initial modular monorepo foundation for the
Lithuania-first MVP.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Docker Desktop
- Flutter SDK for mobile development

## Local setup

1. Copy `.env.example` to `.env`.
2. Start local infrastructure:

   ```powershell
   docker compose up -d
   ```

3. Install JavaScript dependencies:

   ```powershell
   npm install
   ```

4. Run the API:

   ```powershell
   npm run dev:api
   ```

5. Check the API:

   ```text
   GET http://localhost:3000/v1/health
   GET http://localhost:3000/v1/categories
   ```

The API validates required environment variables during startup. Do not commit
`.env` or production secrets.

## Quality commands

```powershell
npm run typecheck
npm test
npm run build
```

Every implemented backend behavior must have a colocated `*.spec.ts` unit test.
Integration tests will be added when the PostgreSQL repositories are introduced.

## Database migrations

SQL migrations are stored in [infra/migrations](./infra/migrations). They are
ordered numerically and must be applied in order:

1. `0001_initial.sql`
2. `0002_seed_categories.sql`

The current API category service uses the same MVP category definitions as the
seed migration. It will be replaced by the database repository when the
persistence module is implemented.
