#!/bin/sh
set -e

echo "🚀 Starting Elite67..."

echo "⏳ Waiting for database..."
until pg_isready -h postgres -U docker > /dev/null 2>&1; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is up!"

echo "🔄 Running migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seed failed or already seeded"

echo "🎉 Starting application..."
exec node server.js
