#!/bin/bash

cat <<EOF > .env.production
# Ambiente de execução
NODE_ENV=production

# Configurações do Servidor
PORT=5000
HOST=0.0.0.0

# Configurações do Banco de Dados
DB_HOST=$DB_HOST
DB_DATABASE=$DB_DATABASE
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_CONNECTION_LIMIT=20
DB_QUEUE_LIMIT=0

# Configurações de CORS
CORS_ORIGIN=$CORS_ORIGIN

# Configuração do JWT
JWT_SECRET=$JWT_SECRET

# Configuração de Log
LOG_LEVEL=info
EOF

cp .env.production .env

echo ".env.production e .env do backend garantidos."