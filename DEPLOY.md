# 🚀 Guia de Deploy para Produção - Willinox Management

Este guia contém instruções detalhadas para preparar e fazer o deploy da aplicação Willinox Management em produção.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- MySQL/MariaDB
- Git

## 🏗️ Build para Produção

### Opção 1: Script Automático

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

### Opção 2: Manual

1. **Instalar dependências:**
```bash
# Dependências do servidor
npm install

# Dependências do cliente
cd client
npm install
cd ..
```

2. **Compilar o projeto:**
```bash
# Compilar servidor e cliente
npm run build:all

# Ou separadamente:
npm run build        # Apenas servidor
npm run build:client # Apenas cliente
```

## 📁 Estrutura após o Build

```
willinox_management/
├── dist/                 # Servidor compilado (JavaScript)
├── client/.next/         # Cliente compilado (Next.js)
├── client/out/           # Cliente estático (se usar export)
├── .env.production       # Variáveis de ambiente de produção
└── ...
```

## ⚙️ Configuração de Produção

### 1. Variáveis de Ambiente

Edite o arquivo `.env.production`:

```env
NODE_ENV=production

# Banco de Dados
DB_HOST=seu-host-db
DB_DATABASE=willinox
DB_USER=seu-usuario
DB_PASSWORD=sua-senha-segura
DB_CONNECTION_LIMIT=20

# Servidor
PORT=5000
HOST=0.0.0.0

# CORS (ajuste para seu domínio)
CORS_ORIGIN=https://seu-dominio.com

# JWT (use uma chave forte!)
JWT_SECRET=sua-chave-jwt-super-secreta-aqui

# Log
LOG_LEVEL=info
```

### 2. Banco de Dados

Certifique-se de que:
- O MySQL/MariaDB está rodando
- O banco `willinox` existe
- As tabelas estão criadas
- O usuário tem as permissões necessárias

## 🚀 Executar em Produção

### Opção 1: Diretamente com Node.js

```bash
NODE_ENV=production npm start
```

### Opção 2: Com PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar a aplicação
pm2 start npm --name "api" -- start
pm2 start /usr/bin/bash --name client -- -c "npm run start:prod"
# Configurar para iniciar automaticamente
pm2 startup
pm2 save
```

### Opção 3: Com Docker

Crie um `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY client/package*.json ./client/

# Instalar dependências
RUN npm install
RUN cd client && npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build:all

# Expor porta
EXPOSE 5000

# Comando de inicialização
CMD ["npm", "start"]
```

## 🌐 Configuração do Servidor Web

### Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Cliente (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoramento

### Logs

```bash
# Ver logs do PM2
pm2 logs willinox-api

# Ver logs em tempo real
pm2 logs willinox-api --lines 100
```

### Status

```bash
# Status da aplicação
pm2 status

# Monitoramento
pm2 monit
```

## 🔧 Comandos Úteis

```bash
# Reinstalar dependências
npm run clean && npm install

# Rebuild completo
npm run build:all

# Verificar se a aplicação está funcionando
curl http://localhost:5000/health

# Restart da aplicação (PM2)
pm2 restart willinox-api

# Parar aplicação (PM2)
pm2 stop willinox-api
```

## 🛡️ Segurança

1. **Firewall**: Configure para permitir apenas as portas necessárias
2. **HTTPS**: Use certificados SSL (Let's Encrypt recomendado)
3. **Variáveis de Ambiente**: Nunca commite senhas no código
4. **Backup**: Configure backup automático do banco de dados
5. **Updates**: Mantenha as dependências atualizadas

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `pm2 logs`
2. Verifique se o banco está rodando
3. Verifique as variáveis de ambiente
4. Verifique se as portas estão livres

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# Parar aplicação
pm2 stop willinox-api

# Atualizar código
git pull origin main

# Reinstalar dependências (se necessário)
npm install
cd client && npm install && cd ..

# Rebuild
npm run build:all

# Reiniciar
pm2 start willinox-api
```
