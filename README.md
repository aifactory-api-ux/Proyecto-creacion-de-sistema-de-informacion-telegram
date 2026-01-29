# Proyecto Sistema de Informacion Telegram

Sistema web para registrar mensajes de un bot de Telegram, exponer una API REST y mostrar un panel web con estadisticas.

## Stack y requisitos
- Node.js 20
- Express 4.x
- SQLite3
- node-telegram-bot-api
- HTML, CSS y JavaScript
- Python 3 para scripts de validacion
- Docker y Docker Compose opcionales

## Instalacion
1. Instalar dependencias
    npm install
2. Crear archivo de entorno
    cp .env.example .env
3. Configurar variables en .env
    TOKEN=token_del_bot
    DB_PATH=/ruta/al/archivo.db

## Uso rapido
- Desarrollo con recarga
    npm run dev
- Produccion local
    npm start
- Validacion de entorno
    npm run validate

Abrir http://localhost:3000 para el panel web.

## API
Base URL: http://localhost:3000/api

GET /users
Respuesta: lista de usuarios registrados.

POST /users
Body JSON:
    {
      "telegram_id": 12345,
      "username": "usuario",
      "first_name": "Nombre",
      "last_name": "Apellido"
    }

GET /messages
Respuesta: lista de mensajes con metadatos.

POST /messages
Body JSON:
    {
      "user_id": 1,
      "chat_id": "12345",
      "text": "Hola mundo"
    }

GET /stats
Respuesta:
    {
      "users": 10,
      "messages": 50,
      "last_message_at": "2024-01-01T12:00:00.000Z"
    }

## Dashboard
El panel muestra tarjetas de estadisticas, lista de mensajes y un filtro de busqueda. Usa los endpoints anteriores para refrescar datos.

## Estructura del proyecto
- src/server.js servidor Express y API
- src/public/ panel web estatico
- src/bot/ integracion con Telegram
- src/routes/ rutas API
- src/models/ modelos de datos
- scripts/ herramientas de soporte
- tests/ pruebas automatizadas

## Configuracion
Variables soportadas:
- TOKEN token del bot de Telegram
- DB_PATH ruta al archivo de base de datos SQLite
- PORT puerto del servidor

## Docker
Construccion y ejecucion:
    docker compose up --build

Scripts de inicio:
- ./run.sh en Linux o macOS
- run.bat en Windows
