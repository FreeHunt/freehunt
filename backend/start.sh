#!/bin/sh
# Exécuter les migrations Prisma
echo "Running migrations..."
npx prisma migrate deploy
# Démarrer l'application
echo "Starting application..."
node dist/src/main