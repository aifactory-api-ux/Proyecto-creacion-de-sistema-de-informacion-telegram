const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DEFAULT_DB_PATH =
  process.env.DB_PATH ||
  process.env.ADB_PATH ||
  path.join(__dirname, "..", "data", "bot.db");

function ensureDirectory(filePath) {
  if (filePath === ":memory:") {
    return;
  }
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function openDatabase(dbPath) {
  ensureDirectory(dbPath);
  return new sqlite3.Database(dbPath);
}

function initializeDatabase(db) {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER NOT NULL,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      created_at TEXT NOT NULL
    );
  `;
  const messagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      chat_id TEXT,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  return Promise.all([
    runQuery(db, usersTable),
    runQuery(db, messagesTable)
  ]);
}

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function allQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows || []);
    });
  });
}

function parseLimit(value, fallback = 25) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, 1), 100);
}

function createApp(options = {}) {
  const dbPath = options.dbPath || DEFAULT_DB_PATH;
  const db = openDatabase(dbPath);
  const dbReady = initializeDatabase(db);
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  const publicDir = path.join(__dirname, "public");
  app.use(express.static(publicDir));

  app.get("/api/users", async (req, res, next) => {
    try {
      await dbReady;
      const limit = parseLimit(req.query.limit, 50);
      const users = await allQuery(
        db,
        "SELECT id, telegram_id, username, first_name, last_name, created_at FROM users ORDER BY created_at DESC LIMIT ?",
        [limit]
      );
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users", async (req, res, next) => {
    try {
      await dbReady;
      const payload = req.body || {};
      const telegramId = Number(payload.telegram_id);
      if (!Number.isInteger(telegramId) || telegramId <= 0) {
        res.status(400).json({ error: "telegram_id invalido" });
        return;
      }
      const username = payload.username ? String(payload.username) : null;
      const firstName = payload.first_name ? String(payload.first_name) : null;
      const lastName = payload.last_name ? String(payload.last_name) : null;
      const createdAt = new Date().toISOString();

      const result = await runQuery(
        db,
        "INSERT INTO users (telegram_id, username, first_name, last_name, created_at) VALUES (?, ?, ?, ?, ?)",
        [telegramId, username, firstName, lastName, createdAt]
      );

      res.status(201).json({
        id: result.lastID,
        telegram_id: telegramId,
        username,
        first_name: firstName,
        last_name: lastName,
        created_at: createdAt
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/messages", async (req, res, next) => {
    try {
      await dbReady;
      const limit = parseLimit(req.query.limit, 25);
      const messages = await allQuery(
        db,
        `
          SELECT m.id, m.text, m.chat_id, m.created_at,
                 u.username, u.first_name, u.last_name
          FROM messages m
          LEFT JOIN users u ON m.user_id = u.id
          ORDER BY m.created_at DESC
          LIMIT ?
        `,
        [limit]
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/messages", async (req, res, next) => {
    try {
      await dbReady;
      const payload = req.body || {};
      const userId = Number(payload.user_id);
      if (!Number.isInteger(userId) || userId <= 0) {
        res.status(400).json({ error: "user_id invalido" });
        return;
      }
      const text = payload.text ? String(payload.text).trim() : "";
      if (!text) {
        res.status(400).json({ error: "text es requerido" });
        return;
      }
      const chatId = payload.chat_id ? String(payload.chat_id) : null;
      const createdAt = new Date().toISOString();

      const result = await runQuery(
        db,
        "INSERT INTO messages (user_id, chat_id, text, created_at) VALUES (?, ?, ?, ?)",
        [userId, chatId, text, createdAt]
      );

      res.status(201).json({
        id: result.lastID,
        user_id: userId,
        chat_id: chatId,
        text,
        created_at: createdAt
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/stats", async (req, res, next) => {
    try {
      await dbReady;
      const usersRow = await getQuery(db, "SELECT COUNT(*) as count FROM users");
      const messagesRow = await getQuery(db, "SELECT COUNT(*) as count FROM messages");
      const lastRow = await getQuery(db, "SELECT MAX(created_at) as last_message_at FROM messages");
      res.json({
        users: usersRow ? usersRow.count : 0,
        messages: messagesRow ? messagesRow.count : 0,
        last_message_at: lastRow ? lastRow.last_message_at : null
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: "Ruta no encontrada" });
      return;
    }
    next();
  });

  app.use((error, req, res, next) => {
    console.error("Unhandled error", error);
    res.status(500).json({ error: "Error interno del servidor" });
  });

  return { app, db };
}

function startServer() {
  const { app } = createApp();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
