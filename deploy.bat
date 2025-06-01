@echo off
echo 🚀 Iniciando processo de deploy para produção...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se o npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não está instalado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

echo 📦 Instalando dependências do servidor...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do servidor.
    pause
    exit /b 1
)

echo 📦 Instalando dependências do cliente...
cd client
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do cliente.
    cd ..
    pause
    exit /b 1
)
cd ..

echo 🏗️ Compilando o servidor...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao compilar o servidor. Verifique os erros acima.
    pause
    exit /b 1
)

echo 🏗️ Compilando o cliente...
npm run build:client
if %errorlevel% neq 0 (
    echo ❌ Erro ao compilar o cliente. Verifique os erros acima.
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!
echo 📁 Arquivos de produção gerados:
echo    - Servidor: .\dist\
echo    - Cliente: .\client\.next\
echo.
echo 🚀 Para iniciar em produção, execute:
echo    set NODE_ENV=production && npm start
echo.
echo 📝 Não esqueça de:
echo    1. Configurar o arquivo .env.production com suas credenciais
echo    2. Configurar o banco de dados
echo    3. Configurar o servidor web (nginx, apache, etc.)
echo    4. Configurar o processo manager (PM2, etc.)

pause
