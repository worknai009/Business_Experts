import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "./models.js";
import { handle } from "./crud.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ROLES = new Set(["user", "admin", "editor", "superadmin"]);
const roleLabel = (role) => role === "superadmin" ? "SUPER_ADMIN" : role.toUpperCase();

export async function ensureAdminUser() {
  const accounts = [{
    email: process.env.ADMIN_EMAIL || "admin@businessexperts.asia",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
    name: "Administrator"
  }];
  if (process.env.SUPERADMIN_EMAIL && process.env.SUPERADMIN_PASSWORD) {
    accounts.push({
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superadmin",
      name: "Super Administrator"
    });
  }
  for (const account of accounts) {
    const email = account.email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== account.role) {
        throw new Error(`Bootstrap account ${email} already exists with a different role.`);
      }
      continue;
    }
    await User.create({
      name: account.name, email, role: account.role,
      passwordHash: await bcrypt.hash(account.password, 12)
    });
    console.log(`Created ${account.role} account: ${email}`);
  }
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d", algorithm: "HS256"
  });
}

export function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response.status(401).json({ ok: false, error: "Authentication required." });
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    if (!payload.sub || !ROLES.has(payload.role) || payload.purpose) throw new Error("Invalid session");
    request.user = payload;
    next();
  } catch {
    response.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}

export function requireStaff(request, response, next) {
  if (!["admin", "editor", "superadmin"].includes(request.user?.role)) {
    return response.status(403).json({ ok: false, error: "Staff access required." });
  }
  next();
}

export function requireSuperadmin(request, response, next) {
  if (request.user?.role !== "superadmin") {
    return response.status(403).json({ ok: false, error: "Super administrator access required." });
  }
  next();
}

function authResponse(user) {
  const identity = {
    email: user.email,
    fullName: user.name,
    name: user.name,
    role: roleLabel(user.role)
  };
  return { ok: true, token: signToken(user), ...identity, user: identity };
}

export const authRouter = Router();

// Bound the in-memory throttle to this single-VPS deployment.
const loginAttempts = new Map();
function throttle(request, response, next) {
  if (request.method !== "POST") return next();
  const now = Date.now();
  for (const [key, entry] of loginAttempts) {
    if (now >= entry.resetAt) loginAttempts.delete(key);
  }
  const key = request.ip;
  const entry = loginAttempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  entry.count += 1;
  loginAttempts.set(key, entry);
  if (entry.count > 30) {
    response.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    return response.status(429).json({ ok: false, error: "Too many attempts. Try again later." });
  }
  next();
}
authRouter.use(throttle);

function login(allowedRoles) {
  return handle(async (request, response) => {
    const { email, password } = request.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password ||
        email.length > 254 || Buffer.byteLength(password, "utf8") > 72) {
      return response.status(400).json({ ok: false, error: "Valid email and password are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ ok: false, error: "Invalid email or password." });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return response.status(403).json({ ok: false, error: "This account cannot access this panel." });
    }
    response.json(authResponse(user));
  });
}

authRouter.post("/login", login());
authRouter.post("/admin-login", login(["admin", "editor", "superadmin"]));
authRouter.post("/super-admin-login", login(["superadmin"]));

authRouter.post("/register", handle(async (request, response) => {
  const { email, password, fullName } = request.body || {};
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return response.status(400).json({ ok: false, error: "Use a valid email and a password of 8 to 72 bytes." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  // Reserve bootstrap identities even if registration arrives during first startup.
  const reserved = [process.env.ADMIN_EMAIL || "admin@businessexperts.asia", process.env.SUPERADMIN_EMAIL]
    .filter(Boolean).map(value => value.trim().toLowerCase());
  if (reserved.includes(normalizedEmail) || await User.findOne({ email: normalizedEmail })) {
    return response.status(409).json({ ok: false, error: "An account already exists for this email." });
  }
  try {
    const user = await User.create({
      email: normalizedEmail,
      name: typeof fullName === "string" ? fullName.trim().slice(0, 100) : normalizedEmail.split("@")[0],
      passwordHash: await bcrypt.hash(password, 12),
      role: "user"
    });
    response.status(201).json(authResponse(user));
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ ok: false, error: "An account already exists for this email." });
    throw error;
  }
}));

authRouter.get("/me", requireAuth, handle(async (request, response) => {
  const user = await User.findById(request.user.sub);
  if (!user) return response.status(401).json({ ok: false, error: "Account no longer exists." });
  const identity = { email: user.email, fullName: user.name, name: user.name, role: roleLabel(user.role) };
  response.json({ ok: true, ...identity, user: identity });
}));
