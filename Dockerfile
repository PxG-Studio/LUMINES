# LUMINES Multi-Stage Dockerfile
# Production-optimized build

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies for better caching
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/*/package.json* ./apps/*/ 2>/dev/null || true
COPY packages/*/package.json* ./packages/*/ 2>/dev/null || true

# Install dependencies
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
RUN npx prisma generate || true

# Build application
RUN npm run build

# Run production validation (only if NODE_ENV is production)
RUN if [ "$NODE_ENV" = "production" ]; then \
      node -e "require('./src/lib/config/validate-production').validateAndLogProductionEnvironment()" || exit 1; \
    fi

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

