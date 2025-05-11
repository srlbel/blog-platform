# Stage 1: Build stage
FROM oven/bun:1 as builder

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apt-get update && \
    apt-get install -y python3 make g++ sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Install dependencies
RUN bun install

# Set environment for DB creation and build
ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db

# Push the schema to create the SQLite DB
RUN bun run db:push:prod

# Compile your Bun app
RUN bun run build

# Stage 2: Minimal runtime image (Debian-based)
FROM debian:bullseye-slim

# Add non-root user
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

# Install SQLite runtime (for reading the .db file)
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copy compiled server and SQLite DB from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/prod.db /app/prod.db

# Set permissions
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Set runtime environment variables
ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["./server"]
