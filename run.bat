@echo off
setlocal

cd /d %~dp0

where docker >nul 2>&1
if errorlevel 1 (
  echo Docker no esta instalado.
  exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
  echo Docker Compose no disponible.
  exit /b 1
)

if not exist data mkdir data

echo Iniciando contenedor...
docker compose up --build
