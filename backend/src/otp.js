import crypto from "crypto";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "./email.js";
import { handle } from "./crud.js";
import { OtpCode } from "./models.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 45 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

export function signOtpToken(email) {
  return jwt.sign({ email: email.toLowerCase(), purpose: "otp-verified" }, JWT_SECRET, { expiresIn: "30m" });
}

export function requireOtpToken(request, response, next) {
  const token = request.body?.otpToken;
  if (!token) {
    response.status(400).json({ ok: false, error: "Email verification is required." });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== "otp-verified") throw new Error("wrong purpose");
    const bodyEmail = String(request.body?.email || "").trim().toLowerCase();
    if (bodyEmail && bodyEmail !== payload.email) {
      response.status(400).json({ ok: false, error: "Verified email does not match submitted email." });
      return;
    }
    request.verifiedEmail = payload.email;
    next();
  } catch {
    response.status(401).json({ ok: false, error: "Email verification expired. Please verify again." });
  }
}

export const otpRouter = Router();

otpRouter.post(
  "/send",
  handle(async (request, response) => {
    const email = String(request.body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      response.status(400).json({ ok: false, error: "A valid email is required." });
      return;
    }

    const recent = await OtpCode.findOne({ email }).sort({ createdAt: -1 }).lean();
    if (recent && Date.now() - new Date(recent.createdAt).getTime() < RESEND_COOLDOWN_MS) {
      response.status(429).json({ ok: false, error: "Please wait before requesting another code." });
      return;
    }

    const code = generateCode();
    await OtpCode.create({
      email,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS)
    });

    const result = await sendOtpEmail(email, code);
    response.json({ ok: true, devCode: result.sent ? undefined : code });
  })
);

otpRouter.post(
  "/verify",
  handle(async (request, response) => {
    const email = String(request.body?.email || "").trim().toLowerCase();
    const code = String(request.body?.code || "").trim();
    if (!EMAIL_RE.test(email) || !code) {
      response.status(400).json({ ok: false, error: "Email and code are required." });
      return;
    }

    const entry = await OtpCode.findOne({ email, consumedAt: null }).sort({ createdAt: -1 });
    if (!entry || entry.expiresAt < new Date()) {
      response.status(400).json({ ok: false, error: "Code expired. Please request a new one." });
      return;
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
      response.status(429).json({ ok: false, error: "Too many attempts. Please request a new code." });
      return;
    }

    if (entry.codeHash !== hashCode(code)) {
      entry.attempts += 1;
      await entry.save();
      response.status(400).json({ ok: false, error: "Incorrect code." });
      return;
    }

    entry.consumedAt = new Date();
    await entry.save();

    response.json({ ok: true, otpToken: signOtpToken(email) });
  })
);
