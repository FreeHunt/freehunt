#!/bin/sh

# Load secrets as environment variables
echo "Loading secrets..."
if [ -f "/run/secrets/database_url" ]; then
  export DATABASE_URL="$(cat /run/secrets/database_url)"
  echo "DATABASE_URL loaded from secret"
fi

# Execute Prisma migrations
echo "Running migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
node dist/src/main
