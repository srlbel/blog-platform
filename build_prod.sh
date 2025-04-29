#!/bin/bash

bun install

FILE1="./test.db"
if [ ! -f "$FILE1" ]; then
    echo "File $FILE1 exists. Creating it."
    Bun run db:push:test
fi

echo "Running tests..."
bun run test
if [ $? -ne 0 ]; then
    echo "Tests failed. Exiting."
    exit 1
fi

FILE2="./prod.db"
if [ ! -f "$FILE2" ]; then
    echo "File $FILE2 exists. Running command..."
    bun run db:push:prod
fi

bun run build
