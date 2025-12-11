# SPARK Production Dockerfile
# Multi-stage build for optimal image size

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for environment variables (passed at build time)
ARG UNITY_MCP_URL
ARG CV_SERVICE_URL
ARG ASR_SERVICE_URL
ARG NATS_URL
ARG NEXT_PUBLIC_NATS_WS_URL
ARG DATABASE_URL

ENV UNITY_MCP_URL=$UNITY_MCP_URL
ENV CV_SERVICE_URL=$CV_SERVICE_URL
ENV ASR_SERVICE_URL=$ASR_SERVICE_URL
ENV NATS_URL=$NATS_URL
ENV NEXT_PUBLIC_NATS_WS_URL=$NEXT_PUBLIC_NATS_WS_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

# Production runner
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
