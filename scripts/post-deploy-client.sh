#!/bin/bash

# Garante .env
if [ ! -f client/.env ]; then
  echo "Criando client/.env..."
  cat <<EOF > client/.env
# Ambiente de desenvolvimento
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
EOF
fi

# Garante .env.development
if [ ! -f client/.env.development ]; then
  echo "Criando client/.env.development..."
  cat <<EOF > client/.env.development
# Ambiente de desenvolvimento
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
EOF
fi

# Garante .env.production
if [ ! -f client/.env.production ]; then
  echo "Criando client/.env.production..."
  cat <<EOF > client/.env.production
# Ambiente de produção
# Substitua pela URL real da sua API em produção
NEXT_PUBLIC_API_BASE_URL=http://152.67.61.74:5000
# Adicione outras variáveis públicas se necessário
EOF
fi

echo "Arquivos de ambiente do client garantidos."
