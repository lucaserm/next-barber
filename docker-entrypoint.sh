#!/bin/sh
set -e

echo "🚀 Starting BarberPro..."

echo "⏳ Waiting for database..."
until pg_isready -h postgres -U docker > /dev/null 2>&1; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is up!"

# Use the orchestrated migration + seed + start flow
node scripts/migrate-and-start.js
