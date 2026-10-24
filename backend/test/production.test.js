import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateProductionConfig } from "../src/productionConfig.js";

process.env.JWT_SECRET = "test-only-secret-which-is-at-least-thirty-two-characters";
const tempRoot = path.resolve(tmpdir());
const testDir = mkdtempSync(path.join(tempRoot, "be-deploy-test-"));
process.env.SITE_CONTENT_FILE = path.join(testDir, "site_content.json");

const { authRouter, signToken, requireAuth, requireStaff } = await import("../src/auth.js");
const { aiRouter } = await import("../src/ai/aiRoutes.js");
const { User } = await import("../src/models.js");
const password = "correct-test-password";
const hash = await bcrypt.hash(password, 4);
const users = ["user", "admin", "superadmin", "editor"].map((role, index) => ({
  _id: String(index + 1).padStart(24, "0"), email: `${role}@example.com`,
  name: role, role, passwordHash: hash
}));
const original = { findOne: User.findOne, findById: User.findById, create: User.create };
User.findOne = async ({ email }) => users.find(user => user.email === email) || null;
User.findById = async id => users.find(user => user._id === id) || null;
User.create = async input => {
  const user = { ...input, _id: String(users.length + 1).padStart(24, "0") };
  users.push(user);
  return user;
};

const app = express();
app.use(express.json());
app.use("/ai-api", aiRouter);
app.use("/api", aiRouter);
app.use("/", aiRouter);
app.use("/api/auth", authRouter);
app.get("/staff-only", requireAuth, requireStaff, (_req, res) => res.json({ ok: true }));
const server = await new Promise(resolve => {
  const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
});
const base = `http://127.0.0.1:${server.address().port}`;
const request = (route, { token, body, method = body ? "POST" : "GET" } = {}) => fetch(base + route, {
  method,
  headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {})
});

after(async () => {
  Object.assign(User, original);
  await new Promise(resolve => server.close(resolve));
  assert.ok(testDir.startsWith(tempRoot + path.sep));
  rmSync(testDir, { recursive: true, force: true });
});

test("production rejects missing secrets and demo passwords", () => {
  const valid = {
    NODE_ENV: "production", JWT_SECRET: "a".repeat(64), MONGODB_URI: "mongodb://example/db",
    ADMIN_EMAIL: "owner@example.com", ADMIN_PASSWORD: "secure-long-password",
    CORS_ORIGINS: "https://businessexperts.asia"
  };
  assert.doesNotThrow(() => validateProductionConfig(valid));
  assert.doesNotThrow(() => validateProductionConfig({
    ...valid, BOOTSTRAP_ADMIN: "false", ADMIN_EMAIL: "", ADMIN_PASSWORD: ""
  }));
  for (const override of [{ JWT_SECRET: "change-me" }, { ADMIN_PASSWORD: "Admin@BusinessAI2026" },
    { MONGODB_URI: "" }, { ADMIN_EMAIL: "" }, { SUPERADMIN_EMAIL: "super@example.com" }]) {
    assert.throws(() => validateProductionConfig({ ...valid, ...override }));
  }
});

test("login validates stored password and returns a signed JWT", async () => {
  assert.equal((await request("/api/auth/login", { body: { email: "admin@example.com", password: "wrong" } })).status, 401);
  assert.equal((await request("/api/auth/login", { body: { email: "admin@businessai.com", password: "admin123" } })).status, 401);
  const response = await request("/api/auth/login", { body: { email: "ADMIN@example.com", password } });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(jwt.verify(data.token, process.env.JWT_SECRET).role, "admin");
  assert.equal(data.role, "ADMIN");
  const me = await request("/api/auth/me", { token: data.token });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).email, "admin@example.com");
});

test("panel login checks roles and rejects injected email objects", async () => {
  assert.equal((await request("/api/auth/admin-login", { body: { email: "user@example.com", password } })).status, 403);
  assert.equal((await request("/api/auth/super-admin-login", { body: { email: "admin@example.com", password } })).status, 403);
  assert.equal((await request("/api/auth/super-admin-login", { body: { email: "superadmin@example.com", password } })).status, 200);
  assert.equal((await request("/api/auth/login", { body: { email: { $ne: null }, password } })).status, 400);
});

test("registration stores a hash and ignores a requested admin role", async () => {
  const body = { email: "new@example.com", fullName: "New Founder", password, role: "admin" };
  const response = await request("/api/auth/register", { body });
  assert.equal(response.status, 201);
  const user = users.find(user => user.email === body.email);
  assert.equal(user.role, "user");
  assert.notEqual(user.passwordHash, password);
  assert.equal(await bcrypt.compare(password, user.passwordHash), true);
  assert.equal((await request("/api/auth/register", { body })).status, 409);
  assert.equal((await request("/api/auth/register", { body: { ...body, email: "admin@businessexperts.asia" } })).status, 409);
});

test("fake tokens, OTP tokens and regular users cannot access staff APIs", async () => {
  assert.equal((await request("/api/auth/me", { token: "jwt_admin_token_123" })).status, 401);
  const otp = jwt.sign({ email: "admin@example.com", purpose: "otp-verified" }, process.env.JWT_SECRET);
  assert.equal((await request("/staff-only", { token: otp })).status, 401);
  assert.equal((await request("/staff-only", { token: signToken(users[0]) })).status, 403);
  assert.equal((await request("/staff-only", { token: signToken(users[1]) })).status, 200);
});

test("every CMS write alias requires a staff token", async () => {
  for (const prefix of ["/api", "/ai-api", ""]) {
    for (const route of ["/content", "/admin/content", "/admin/content/hero"]) {
      for (const method of ["POST", "PUT"]) {
        assert.equal((await request(prefix + route, { method, body: {} })).status, 401);
        assert.equal((await request(prefix + route, { method, body: {}, token: signToken(users[0]) })).status, 403);
      }
    }
  }
  assert.equal((await request("/api/content")).status, 200);
});

test("authorized CMS edits persist outside the source directory", async () => {
  const marker = { title: "Persisted production content" };
  const response = await request("/api/admin/content/hero", { method: "PUT", body: marker, token: signToken(users[1]) });
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(readFileSync(process.env.SITE_CONTENT_FILE, "utf8")).hero, marker);
  assert.deepEqual((await (await request("/api/content")).json()).hero, marker);
});

test("super administrator endpoints require the correct role", async () => {
  assert.equal((await request("/ai-api/super-admin/system/status")).status, 401);
  assert.equal((await request("/ai-api/super-admin/system/status", { token: signToken(users[1]) })).status, 403);
  assert.equal((await request("/ai-api/super-admin/system/status", { token: signToken(users[2]) })).status, 200);
});

test("login attempts are throttled but session verification stays available", async () => {
  let response;
  for (let i = 0; i < 31; i++) {
    response = await request("/api/auth/login", { body: { email: "admin@example.com", password: "wrong" } });
  }
  assert.equal(response.status, 429);
  assert.ok(response.headers.get("retry-after"));
  assert.equal((await request("/api/auth/me", { token: signToken(users[1]) })).status, 200);
});
