#!/bin/bash

bun install

echo "Running tests..."
bun run test

bun run build
