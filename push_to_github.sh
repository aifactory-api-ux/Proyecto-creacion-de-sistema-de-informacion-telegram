#!/bin/bash

# Script para subir el proyecto a GitHub
# Uso: ./push_to_github.sh <github_token> <repo_name>

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ Uso: ./push_to_github.sh <github_token> <repo_name>${NC}"
    echo ""
    echo "Ejemplo:"
    echo "  ./push_to_github.sh ghp_xxxxxx sistema-telegram-mvp"
    echo ""
    echo "Para obtener un token:"
    echo "  1. Ve a https://github.com/settings/tokens"
    echo "  2. Crea un nuevo token con permisos 'repo'"
    exit 1
fi

GITHUB_TOKEN=$1
REPO_NAME=$2
GITHUB_USER="${3:-$(git config user.name | tr ' ' '-')}"

echo -e "${YELLOW}📦 Subiendo proyecto a GitHub...${NC}"
echo "  Repo: $REPO_NAME"
echo "  Usuario: $GITHUB_USER"
echo ""

# 1. Crear repositorio remoto
echo -e "${YELLOW}1️⃣ Agregando remoto origin...${NC}"
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || \
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# 2. Renombrar rama a main
echo -e "${YELLOW}2️⃣ Renombrando rama a 'main'...${NC}"
git branch -M main || true

# 3. Push al repositorio
echo -e "${YELLOW}3️⃣ Subiendo código a GitHub...${NC}"
git push -u origin main

echo ""
echo -e "${GREEN}✅ Proyecto subido exitosamente!${NC}"
echo ""
echo "Accede a tu repositorio en:"
echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
