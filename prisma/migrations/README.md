# Prisma Migrations

## Creating Migrations

Migrations are automatically created when you run:

```bash
npm run db:migrate
```

This requires `DATABASE_URL` to be set in your environment.

## Manual Migration (If DATABASE_URL is not available)

If you need to create a migration without a database connection, you can:

1. **Set a temporary DATABASE_URL:**

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://user:pass@localhost:5432/lumines"
npm run db:migrate

# Linux/Mac
export DATABASE_URL="postgresql://user:pass@localhost:5432/lumines"
npm run db:migrate
```

2. **Use Docker Compose database:**

```bash
# Start database
docker-compose up -d postgres

# Set DATABASE_URL
export DATABASE_URL="postgresql://lumines:lumines@localhost:5432/lumines_dev"

# Run migration
npm run db:migrate
```

## Migration Files

Migrations are stored in `prisma/migrations/` with the format:
```
YYYYMMDDHHMMSS_migration_name/
  └── migration.sql
```

## Applying Migrations

### Development
```bash
npm run db:migrate
```

### Production
```bash
npm run db:migrate:deploy
```

