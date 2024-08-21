ARG NODE_VERSION=22-alpine

# Build phase
FROM node:$NODE_VERSION AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Prepare node_modules
COPY ./ ./
RUN pnpm prisma generate

RUN chmod +x ./init.sh

# Run phase
FROM node:$NODE_VERSION AS runner

WORKDIR /app

COPY --from=builder /app ./

# Copy artifacts
CMD ./init.sh