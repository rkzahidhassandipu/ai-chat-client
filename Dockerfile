# =========================
# 1. Dependencies stage
# =========================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci


# =========================
# 2. Build stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# =========================
# 3. Production runner
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./

# public folder might not exist — create empty one first then copy if exists
RUN mkdir -p ./public
COPY --from=builder /app/public* ./public/

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["npm", "start"]