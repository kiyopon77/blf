# ============================================
# Base Image
# ============================================
ARG NODE_VERSION=20-alpine

# ============================================
# Stage 1: Install Dependencies
# ============================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# ============================================
# Stage 2: Build Next.js App
# ============================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
RUN echo $NEXT_PUBLIC_API_URL

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

ENV NODE_ENV=production

# Build app
RUN npm run build

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Use non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
