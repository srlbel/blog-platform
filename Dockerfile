FROM oven/bun:1 AS builder

FROM scratch AS export-stage
COPY server /
COPY prod.db /

FROM debian:bookworm-slim

RUN addgroup -S app && adduser -S app -G app

COPY --from=export-stage /server /app/server
COPY --from=export-stage /prod.db /app/prod.db

WORKDIR /app
USER app

EXPOSE 3000

ENV NODE_ENV=prod \
    DB_FILE_NAME=prod.db

# Run compiled server binary
CMD ["./server"]
