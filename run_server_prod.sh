#!/bin/bash

bun install

# Check if a file exists, if it exists, run a command
FILE1="./test.db"
if [ ! -f "$FILE1" ]; then
    echo "File $FILE1 exists. Creating it."
    Bun run db:push:test
fi

# Run a command and wait for it to finish
echo "Running tests..."
bun run test
if [ $? -ne 0 ]; then
    echo "Tests failed. Exiting."
    exit 1
fi

# Step 3: Check if a file exists, if it exists, run a command
FILE2="./prod.db"
if [ ! -f "$FILE2" ]; then
    echo "File $FILE2 exists. Running command..."
    bun run db:push:prod
fi

# Replace with the actual long-running command
bun run prod
