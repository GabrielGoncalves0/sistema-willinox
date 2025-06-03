    #!/bin/bash

echo "[DEBUG] Rodando post-deploy-client.sh em $(pwd)"

# Garante .env
echo "[DEBUG] Criando/verificando client/.env..."
cat <<EOF > client/.env
# Ambiente de desenvolvimento
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
EOF

# Garante .env.development
echo "[DEBUG] Criando/verificando client/.env.development..."
cat <<EOF > client/.env.development
# Ambiente de desenvolvimento
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
EOF

# Garante .env.production
echo "[DEBUG] Criando/verificando client/.env.production..."
cat <<EOF > client/.env.production
# Ambiente de produção
NEXT_PUBLIC_API_BASE_URL=http://152.67.61.74:5000
EOF

echo "[DEBUG] Arquivos de ambiente do client garantidos."
ls -l client/.env*
