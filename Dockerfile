# Multi-stage Dockerfile for Hikarii Fullstack Application
# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install system dependencies needed for native modules & build
RUN apk add --no-cache openssl python3 make g++

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (clean install)
RUN npm ci

# Copy full application source
COPY . .

# Generate Prisma client and build bundle
RUN npx prisma generate
RUN npm run build

# Stage 2: Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init

ENV NODE_ENV=production
ENV PORT=5005

# Copy build artifacts and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 5005

# Run using non-root user
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist-server/app.js"]
