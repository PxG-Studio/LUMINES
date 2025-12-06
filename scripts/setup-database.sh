#!/bin/bash
# Database Setup Script
# Sets up database with migrations and seed data

set -e

echo "🗄️  Setting up LUMINES database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL not set. Using default connection."
  echo "   Set DATABASE_URL environment variable for custom connection."
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || npx prisma migrate dev --name init

# Seed database (optional, only if NODE_ENV is development)
if [ "$NODE_ENV" != "production" ]; then
  echo "🌱 Seeding database..."
  npm run db:seed || echo "⚠️  Seeding failed or skipped"
fi

echo "✅ Database setup complete!"

