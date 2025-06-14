#!/bin/bash

echo "🚀 Starting deployment..."

# Ir para o diretório do projeto (corrigindo o caminho)
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
cd "$PROJECT_DIR"

# Backup dos arquivos de configuração
echo "📦 Creating backup of configuration files..."
if [ -f .env ]; then
    cp .env .env.backup
fi
if [ -d nginx/conf.d ]; then
    cp -r nginx/conf.d nginx/conf.d.backup
fi
if [ -d nginx/ssl ]; then
    cp -r nginx/ssl nginx/ssl.backup
fi

# Puxar alterações do Git
echo "⬇️ Pulling latest changes from Git..."
git stash
git pull origin main

# Restaurar configurações locais
echo "🔄 Restoring configuration files..."
if [ -f .env.backup ]; then
    cp .env.backup .env
fi
if [ -d nginx/conf.d.backup ]; then
    cp -r nginx/conf.d.backup/* nginx/conf.d/
    rm -rf nginx/conf.d.backup
fi
if [ -d nginx/ssl.backup ]; then
    cp -r nginx/ssl.backup/* nginx/ssl/
    rm -rf nginx/ssl.backup
fi

# Reconstruir e reiniciar containers
echo "🏗️ Rebuilding and restarting containers..."
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml up -d --build

# Verificar status
echo "🔍 Checking service status..."
sleep 10
sudo docker ps

# Verificar logs por erros
echo "📋 Checking logs for errors..."
sudo docker-compose -f docker-compose.prod.yml logs --tail=50 app

echo "✅ Deployment completed!"

# Testar a API
echo "🔌 Testing API health..."
curl -sk https://localhost/health || echo "❌ Health check failed" 