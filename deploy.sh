#!/bin/bash

# Script de Deploy para Produção
echo "🚀 Iniciando processo de deploy para produção..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "📦 Instalando dependências do servidor..."
npm install

echo "📦 Instalando dependências do cliente..."
cd client
npm install
cd ..

echo "🏗️ Compilando o servidor..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o servidor. Verifique os erros acima."
    exit 1
fi

echo "🏗️ Compilando o cliente..."
npm run build:client

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o cliente. Verifique os erros acima."
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos de produção gerados:"
echo "   - Servidor: ./dist/"
echo "   - Cliente: ./client/.next/"
echo ""
echo "🚀 Para iniciar em produção, execute:"
echo "   NODE_ENV=production npm start"
echo ""
echo "📝 Não esqueça de:"
echo "   1. Configurar o arquivo .env.production com suas credenciais"
echo "   2. Configurar o banco de dados"
echo "   3. Configurar o servidor web (nginx, apache, etc.)"
echo "   4. Configurar o processo manager (PM2, systemd, etc.)"
