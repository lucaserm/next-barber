#!/bin/sh
set -e

echo "🚀 Starting BarberPro..."

echo "⏳ Waiting for database..."
until pg_isready -h postgres -U docker > /dev/null 2>&1; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is up!"

echo "🔄 Running migrations..."
./node_modules/.bin/prisma migrate deploy || {
  echo "❌ Migrations failed"
  exit 1
}

echo "🌱 Seeding database..."
./node_modules/.bin/prisma db seed || echo "⚠️ Seed skipped (already seeded or no seed file)"

echo "🎉 Starting application..."
exec node server.js
