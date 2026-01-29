#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker no esta instalado."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose no disponible."
  exit 1
fi

mkdir -p data

echo "Iniciando contenedor..."
docker compose up --build
