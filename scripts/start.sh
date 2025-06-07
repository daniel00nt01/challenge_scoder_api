#!/bin/sh

# Função para testar conexão com PostgreSQL
postgres_ready() {
  pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME > /dev/null 2>&1
}

# Aguardar o PostgreSQL iniciar
echo "Waiting for PostgreSQL to start..."
until postgres_ready; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up and running!"

# Executar migrações
echo "Running migrations..."
NODE_ENV=production npm run migration:run

# Iniciar a aplicação
echo "Starting application..."
NODE_ENV=production npm start 