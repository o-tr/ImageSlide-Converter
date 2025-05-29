ARG NODE_VERSION=22-alpine

# Build phase
FROM node:$NODE_VERSION AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile

# Prepare node_modules
COPY ./ ./

# Run phase
FROM node:$NODE_VERSION AS runner


WORKDIR /app
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

COPY --from=builder /app ./

COPY ./docker/.env.placeholder ./.env

RUN npx prisma generate
RUN npm run build

COPY ./docker/env-replacer.sh ./
COPY ./init.sh ./

# Convert Windows line endings to Unix and set executable permissions
RUN sed -i 's/\r$//' ./env-replacer.sh && \
    sed -i 's/\r$//' ./init.sh && \
    chmod +x ./env-replacer.sh && \
    chmod +x ./init.sh
ENTRYPOINT [ "/app/env-replacer.sh" ]

# Copy artifacts
CMD ["./init.sh"]
