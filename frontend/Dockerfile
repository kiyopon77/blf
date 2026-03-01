# ============================================
# Base Image
# ============================================

ARG NODE_VERSION=20-alpine

# ============================================
# Stage 1: Install Dependencies
# ============================================

FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files first (for Docker cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci
# ============================================
# Base Image
# ============================================

ARG NODE_VERSION=20-alpine

# ============================================
# Stage 1: Install Dependencies
# ============================================

FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files first (for Docker cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# ============================================
# Stage 2: Build Next.js App
# ============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# ============================================
# Stage 3: Production Runner
# ============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy required production files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Use non-root user for security
USER node

EXPOSE 3000

CMD ["node", "server.js"]
# ============================================
# Stage 2: Build Next.js App
# ============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# ============================================
# Stage 3: Production Runner
# ============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy required production files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Use non-root user for security
USER node

EXPOSE 3000

CMD ["node", "server.js"]
