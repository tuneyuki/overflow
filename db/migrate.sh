#!/bin/bash

# ==============================
# PostgreSQL migration script
# ==============================

DB_NAME="stackoverflow_clone"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "🚀 Creating database if not exists..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME"

echo "📦 Applying schema..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f schema.sql

echo "✅ Migration completed!"
