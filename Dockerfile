# Stage 1: Build Bun app and database
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN bun install

# Generate prod.db (SQLite) using drizzle
ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db
RUN bun run db:push:prod

# Compile the server to a native Bun binary
RUN bun run build

# Stage 2: Minimal runtime image
FROM alpine:3.19

# Add non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy compiled server and DB from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/prod.db /app/prod.db

WORKDIR /app
USER app

ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db

EXPOSE 3000

CMD ["./server"]
