#!/bin/bash

bun install

echo "Running tests..."
bun run test
if [ $? -ne 0 ]; then
    echo "Tests failed. Exiting."
    exit 1
fi

FILE2="./prod.db"
if [ ! -f "$FILE2" ]; then
    echo "File $FILE2 DONT'T exists. Creating it."
    bun run db:push:prod
fi

bun run build
