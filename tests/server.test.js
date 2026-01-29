const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../src/server");

let server;
let db;
let baseUrl;

function startServer() {
  const created = createApp({ dbPath: ":memory:" });
  const { app } = created;
  db = created.db;
  server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
}

function stopServer() {
  if (!server) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    server.close(() => {
      if (db) {
        db.close(() => resolve());
        return;
      }
      resolve();
    });
  });
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  return { status: response.status, body };
}

before(async () => {
  await startServer();
});

after(async () => {
  await stopServer();
});

test("POST /api/users creates a user", async () => {
  const payload = {
    telegram_id: 12345,
    username: "monitor",
    first_name: "Ada",
    last_name: "Lovelace"
  };

  const response = await request("/api/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  assert.equal(response.status, 201);
  assert.ok(response.body.id);
  assert.equal(response.body.telegram_id, payload.telegram_id);
});

test("POST /api/messages creates a message", async () => {
  const userResponse = await request("/api/users", {
    method: "POST",
    body: JSON.stringify({
      telegram_id: 54321,
      username: "reporter",
      first_name: "Nora",
      last_name: "Jones"
    })
  });

  const messageResponse = await request("/api/messages", {
    method: "POST",
    body: JSON.stringify({
      user_id: userResponse.body.id,
      chat_id: "general",
      text: "Mensaje de prueba"
    })
  });

  assert.equal(messageResponse.status, 201);
  assert.ok(messageResponse.body.id);
  assert.equal(messageResponse.body.text, "Mensaje de prueba");
});

test("GET /api/messages returns list", async () => {
  const response = await request("/api/messages?limit=5");
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("GET /api/stats returns counts", async () => {
  const response = await request("/api/stats");
  assert.equal(response.status, 200);
  assert.ok(Number.isInteger(response.body.users));
  assert.ok(Number.isInteger(response.body.messages));
});
