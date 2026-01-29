# DEVELOPMENT PLAN: Proyecto creacion de sistema de informacion telegram

## 1. ARCHITECTURE OVERVIEW
**Components:**
- Backend: Express.js REST API with SQLite database
- Telegram Bot: node-telegram-bot-api integration
- Frontend: Basic HTML/CSS/JavaScript dashboard
- Database: SQLite with migrations

**Models:**
- Users: Telegram user information
- Messages: Telegram messages stored
- Commands: Bot command history

**APIs:**
- `/api/users`: CRUD for users
- `/api/messages`: Message management
- `/api/stats`: System statistics
- `/api/bot`: Bot control endpoints

**File Structure:**
```
project/
├── src/
│   ├── server.js          # Express server
│   ├── bot/              # Telegram bot logic
│   │   ├── bot.js
│   │   └── commands.js
│   ├── models/           # Database models
│   │   ├── index.js
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/           # API routes
│   │   ├── index.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── controllers/      # Business logic
│   │   ├── userController.js
│   │   └── messageController.js
│   ├── database/         # DB configuration
│   │   ├── db.js
│   │   └── migrations/
│   └── public/           # Frontend files
│       ├── index.html
│       ├── style.css
│       └── app.js
├── tests/               # Test files
├── scripts/             # Python scripts for file creation
├── package.json
├── .env.example
└── README.md
```

## 2. MVP ACCEPTANCE CRITERIA
1. Telegram bot responds to /start command with welcome message
2. Web dashboard displays at least 10 latest messages from database
3. API endpoint `/api/stats` returns JSON with total users and messages count
4. All database tables (users, messages) are created on startup
5. Frontend can fetch and display message statistics

## 3. EXECUTABLE ITEMS

### ITEM 1: Project Setup & Core Configuration
**Goal:** Initialize Node.js project with basic structure and dependencies
**Files to create/modify:**
- package.json (create) - Project dependencies and scripts
- .env.example (create) - Environment variables template
- .gitignore (create) - Git ignore rules
- src/server.js (create) - Express server skeleton
- src/database/db.js (create) - SQLite connection setup
**Dependencies:** None
**Validation:** `npm install` succeeds and `node src/server.js` starts without errors

### ITEM 2: Database Models & Migrations
**Goal:** Create SQLite database with Users and Messages tables
**Files to create/modify:**
- src/models/index.js (create) - Model initialization
- src/models/User.js (create) - User model definition
- src/models/Message.js (create) - Message model definition
- src/database/migrations/001_create_tables.sql (create) - SQL migration
- scripts/create_db.py (create) - Python script to initialize database
**Dependencies:** Item 1
**Validation:** Database file created with correct schema, tables exist

### ITEM 3: Telegram Bot Integration
**Goal:** Implement Telegram bot with basic commands and message handling
**Files to create/modify:**
- src/bot/bot.js (create) - Bot initialization and setup
- src/bot/commands.js (create) - Command handlers
- src/controllers/messageController.js (create) - Message processing logic
**Dependencies:** Items 1-2
**Validation:** Bot responds to /start command and stores messages in database

### ITEM 4: REST API Endpoints
**Goal:** Create Express API routes for users, messages, and statistics
**Files to create/modify:**
- src/routes/index.js (create) - Main router
- src/routes/users.js (create) - User routes
- src/routes/messages.js (create) - Message routes
- src/routes/stats.js (create) - Statistics routes
- src/controllers/userController.js (create) - User business logic
- src/controllers/statsController.js (create) - Statistics logic
**Dependencies:** Items 1-3
**Validation:** All API endpoints return correct JSON responses, POST/GET work

### ITEM 5: Frontend Dashboard
**Goal:** Create basic web interface to display messages and statistics
**Files to create/modify:**
- src/public/index.html (create) - Main dashboard page
- src/public/style.css (create) - Basic styling
- src/public/app.js (create) - Frontend JavaScript
- src/server.js (modify) - Add static file serving
**Dependencies:** Items 1-4
**Validation:** Dashboard loads in browser, displays messages, fetches stats via API

### ITEM 6: Testing & Validation
**Goal:** Add basic tests and validation scripts
**Files to create/modify:**
- tests/server.test.js (create) - API endpoint tests
- tests/bot.test.js (create) - Bot functionality tests
- package.json (modify) - Add test scripts
- scripts/validate_setup.py (create) - Python validation script
**Dependencies:** Items 1-5
**Validation:** `npm test` runs successfully, validation script passes

### ITEM 7: Infrastructure
**Goal:** Create Docker + scripts for easy deployment
**Files to create/modify:**
- Dockerfile (create) - Container definition
- docker-compose.yml (create) - Multi-service setup
- run.sh (create) - Linux/Mac startup script
- run.bat (create) - Windows startup script
- README.md (create) - Project documentation
**Dependencies:** All previous
**Validation:** `docker compose up` starts all services, scripts execute without errors