# Stage 1: Build stage
FROM oven/bun:1 as builder

WORKDIR /app

# Add required build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy source files
COPY . .

# Install dependencies (make sure better-sqlite3 is in package.json)
RUN bun install

# Set environment for DB generation and build
ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db

# Create the SQLite DB schema
RUN bun run db:push:prod

# Compile Bun server into a native binary
RUN bun run build

# Stage 2: Minimal runtime image
FROM alpine:3.19

# Add non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy compiled server and DB from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/prod.db /app/prod.db

# Set permissions (optional but good practice)
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Set runtime env vars
ENV NODE_ENV=prod
ENV DB_FILE_NAME=prod.db

# Expose port (change if needed)
EXPOSE 3000

# Run the server binary
CMD ["./server"]
