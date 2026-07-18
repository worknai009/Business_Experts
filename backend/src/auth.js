import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "./models.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || "admin@businessexperts.asia").toLowerCase();
  if (await User.findOne({ email })) return;

  const password = process.env.ADMIN_PASSWORD || "admin123";
  await User.create({
    name: "Administrator",
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: "admin"
  });
  console.log(`Admin user created: ${email}`);
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    response.status(401).json({ ok: false, error: "Authentication required." });
    return;
  }
  try {
    request.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    response.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body || {};
  if (!email || !password) {
    response.status(400).json({ ok: false, error: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    response.status(401).json({ ok: false, error: "Invalid email or password." });
    return;
  }

  response.json({
    ok: true,
    token: signToken(user),
    user: { name: user.name, email: user.email, role: user.role }
  });
});

authRouter.get("/me", requireAuth, (request, response) => {
  response.json({ ok: true, user: request.user });
});
