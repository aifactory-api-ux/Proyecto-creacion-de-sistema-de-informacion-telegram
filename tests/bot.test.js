const { test } = require("node:test");
const assert = require("node:assert/strict");

function buildToken() {
  return "000000:TEST_TOKEN";
}

test("telegram bot library exports a constructor", () => {
  const TelegramBot = require("node-telegram-bot-api");
  assert.equal(typeof TelegramBot, "function");
});

test("telegram bot can be instantiated without polling", () => {
  const TelegramBot = require("node-telegram-bot-api");
  const bot = new TelegramBot(buildToken(), { polling: false, webHook: false });
  assert.ok(bot);
  assert.equal(typeof bot.sendMessage, "function");
});

test("token format includes separator", () => {
  const token = buildToken();
  assert.ok(token.includes(":"));
  assert.ok(token.split(":").length >= 2);
});
