# Prisma Migration Guide

**Complete guide for Prisma database migrations**

---

## Prerequisites

- PostgreSQL database running
- `DATABASE_URL` environment variable set
- Prisma CLI installed (`npm install -g prisma` or use `npx prisma`)

---

## Initial Setup

### 1. Generate Prisma Client

```bash
npm run db:generate
# or
npx prisma generate
```

### 2. Create Initial Migration

```bash
npm run db:migrate
# or
npx prisma migrate dev --name init
```

This will:
- Create the initial migration in `prisma/migrations/`
- Apply the migration to your database
- Generate the Prisma client

---

## Development Workflow

### Make Schema Changes

1. Edit `prisma/schema.prisma`
2. Create and apply migration:

```bash
npx prisma migrate dev --name describe_your_changes
```

Example:
```bash
npx prisma migrate dev --name add_user_avatar_field
```

### Reset Database (Development Only)

⚠️ **WARNING: This will delete all data!**

```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Recreate it
- Apply all migrations
- Run seed script

---

## Production Deployment

### Deploy Migrations

```bash
npx prisma migrate deploy
```

This will:
- Apply pending migrations
- **NOT** reset the database
- **NOT** run seed scripts
- Safe for production use

### Verify Migration Status

```bash
npx prisma migrate status
```

---

## Seed Data

### Run Seed Script

```bash
npm run db:seed
# or
npx prisma db seed
```

The seed script (`prisma/seed.ts`) creates:
- Development user
- Sample project
- Sample template
- Sample component
- Design tokens
- Sample build
- Sample deployment
- Sample events

---

## Common Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed

# Deploy migrations (production)
npm run db:migrate:deploy

# Check migration status
npx prisma migrate status

# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

---

## Migration Best Practices

### 1. Always Review Generated SQL

Before applying migrations in production, review the generated SQL:

```bash
# Create migration without applying
npx prisma migrate dev --create-only --name migration_name

# Review the SQL in prisma/migrations/[timestamp]_migration_name/migration.sql

# Then apply
npx prisma migrate dev
```

### 2. Use Descriptive Migration Names

```bash
# ✅ Good
npx prisma migrate dev --name add_user_last_login_at

# ❌ Bad
npx prisma migrate dev --name update
```

### 3. Test Migrations Locally First

Always test migrations in a development environment before applying to production.

### 4. Backup Before Production Migrations

```bash
# Create database backup
pg_dump -h 192.168.86.27 -U lumines lumines > backup_$(date +%Y%m%d).sql

# Then apply migrations
npx prisma migrate deploy
```

---

## Troubleshooting

### Migration Conflicts

If you have migration conflicts:

```bash
# Mark migration as applied (if already applied manually)
npx prisma migrate resolve --applied migration_name

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back migration_name
```

### Reset Development Database

```bash
# Drop and recreate database
npx prisma migrate reset
```

### Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1"

# Check Prisma client
npx prisma generate
```

### Schema Validation Errors

```bash
# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## Schema Changes

### Adding a Field

1. Edit `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields
  lastLoginAt DateTime? // Add new field
}
```

2. Create migration:

```bash
npx prisma migrate dev --name add_user_last_login_at
```

### Removing a Field

1. Edit `prisma/schema.prisma` (remove field)
2. Create migration (data will be lost):

```bash
npx prisma migrate dev --name remove_user_avatar
```

### Renaming a Field

1. Add new field with different name
2. Create migration
3. Migrate data (custom SQL)
4. Remove old field

Or use `@map` to rename in database without changing code:

```prisma
model User {
  email String @map("user_email") // Maps to user_email column
}
```

---

## Database Indexes

Indexes are defined in the schema:

```prisma
model User {
  // ... fields
  @@index([email])
  @@index([nocturnaId])
}
```

After adding indexes, create a migration:

```bash
npx prisma migrate dev --name add_user_indexes
```

---

## Relationships

Relationships are defined in the schema:

```prisma
model User {
  projects Project[]
}

model Project {
  userId String
  user   User @relation(fields: [userId], references: [id])
}
```

Prisma handles foreign keys automatically.

---

## Production Checklist

Before deploying migrations to production:

- [ ] Review generated SQL
- [ ] Test migrations in staging
- [ ] Backup database
- [ ] Schedule maintenance window (if needed)
- [ ] Verify rollback plan
- [ ] Monitor migration execution
- [ ] Verify data integrity after migration

---

## CI/CD Integration

### GitHub Actions

Add to your CI workflow:

```yaml
- name: Run migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Docker

Add to Dockerfile:

```dockerfile
RUN npx prisma generate
RUN npx prisma migrate deploy
```

Or use init container in Kubernetes:

```yaml
initContainers:
  - name: migrate
    image: lumines:latest
    command: ["npx", "prisma", "migrate", "deploy"]
```

---

**Last Updated:** December 2024

