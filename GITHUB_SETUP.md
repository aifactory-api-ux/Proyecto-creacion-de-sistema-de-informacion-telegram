# 📱 Sistema de Información con Telegram - MVP

> Proyecto descargado desde MinIO (ID: 2fe5f0ba-e6d7-494d-beb5-c04f64b3d134)
> Inicializado como repositorio Git local

## 🚀 Descripción

Sistema de gestión de información con integración de Telegram que permite:
- Crear y gestionar usuarios desde el bot de Telegram
- Enviar y almacenar mensajes
- Consultar estadísticas en tiempo real
- API REST completa para integraciones

## 📋 Estructura del Proyecto

```
proyecto-2fe5f0ba/
├── src/
│   ├── bot/                 # Bot de Telegram
│   ├── controllers/         # Controladores de lógica
│   ├── database/           # Configuración SQLite
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas API
│   ├── public/             # Frontend
│   └── server.js           # Servidor Express
├── docs/                   # Documentación técnica
├── scripts/                # Scripts de utilidad
├── tests/                  # Tests unitarios
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Orquestación de servicios
├── package.json            # Dependencias Node.js
└── README.md              # Este archivo
```

## 🛠️ Requisitos

- Node.js v14+
- npm o pnpm
- SQLite3
- Telegram Bot Token

## 📦 Instalación

### 1. Clonar/Descargar el proyecto
```bash
cd proyecto-2fe5f0ba
```

### 2. Instalar dependencias
```bash
npm install
# o
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
# TELEGRAM_BOT_TOKEN=tu_token_aqui
# PORT=3000
# DB_PATH=./data/bot.db
```

### 4. Inicializar base de datos
```bash
python3 scripts/create_db.py
```

### 5. Iniciar el servidor
```bash
npm start
# o desde el script
./run.sh  # Linux/Mac
run.bat   # Windows
```

## 🔌 API REST

### Usuarios
```
GET    /api/users              - Listar usuarios
POST   /api/users              - Crear usuario
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"telegram_id":123456789,"first_name":"Juan"}'
```

### Mensajes
```
GET    /api/messages           - Listar mensajes
POST   /api/messages           - Crear mensaje
```

### Estadísticas
```
GET    /api/stats              - Obtener estadísticas
```

## 🤖 Bot de Telegram

### Comandos disponibles
- `/start` - Iniciar interacción
- `/help` - Mostrar ayuda
- `/users` - Listar usuarios
- `/messages` - Ver mensajes

## 🧪 Testing

```bash
npm test
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t sistema-telegram .

# Ejecutar contenedor
docker run -p 3000:3000 sistema-telegram

# Con docker-compose
docker-compose up -d
```

## 📚 Documentación

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Development Plan](./docs/DEVELOPMENT_PLAN.md)
- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Code Reference](./docs/CODE_REFERENCE.md)

## 🔑 Variables de Entorno (.env)

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/bot.db
TELEGRAM_BOT_TOKEN=your_token_here
LOG_LEVEL=info
```

## 📊 Base de Datos

SQLite con las siguientes tablas:
- `users` - Información de usuarios de Telegram
- `messages` - Mensajes enviados/recibidos

## 🤝 Contribuir

Para contribuir al proyecto:
1. Fork el repositorio
2. Crear rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es de código cerrado. Contacta a AI Factory para más información.

## 👨‍💻 Autor

**AI Factory Development Team**

## 📞 Soporte

Para reportar problemas o sugerencias:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

## 🔄 Subir a GitHub

### Opción 1: Usando GitHub CLI
```bash
# Instalar GitHub CLI si no lo tienes
# https://cli.github.com

gh repo create sistema-telegram-mvp \
  --source=. \
  --remote=origin \
  --push \
  --public
```

### Opción 2: Usando Git (Manual)
```bash
# Crear repositorio en GitHub manualmente primero
# Luego:

git remote add origin https://github.com/tu-usuario/sistema-telegram-mvp.git
git branch -M main
git push -u origin main
```

### Opción 3: Desde GitHub Web
1. Ir a https://github.com/new
2. Crear nuevo repositorio
3. Seguir las instrucciones mostradas

---

**Generado:** 2026-01-29
**Proyecto ID:** 2fe5f0ba-e6d7-494d-beb5-c04f64b3d134
