FROM node:18-alpine

WORKDIR /app

# Instalar ferramentas necessárias
RUN apk add --no-cache postgresql-client dos2unix

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Converter formato do script para Unix e torná-lo executável
RUN dos2unix ./scripts/start.sh \
    && chmod +x ./scripts/start.sh \
    && apk del dos2unix

# Compilar TypeScript
RUN npm run build

# Expor porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação usando o script
CMD ["sh", "./scripts/start.sh"] 