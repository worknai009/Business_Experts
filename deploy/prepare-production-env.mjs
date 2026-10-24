import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import { validateProductionConfig } from "../backend/src/productionConfig.js";

const source = resolve(process.argv[2] || "backend/.env");
const target = resolve(process.argv[3] || ".env.production.ready");
if (existsSync(target)) throw new Error("Prepared environment already exists; preserve/review it instead of generating new secrets.");
const env = parseEnv(readFileSync(source, "utf8"));
if (!/^mongodb(?:\+srv)?:\/\//.test(env.MONGODB_URI || "")) {
  throw new Error("The source must contain the verified existing MongoDB connection.");
}
let replacedJwt = false;
if (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || /change-me|dev-secret/i.test(env.JWT_SECRET)) {
  env.JWT_SECRET = randomBytes(48).toString("hex");
  replacedJwt = true;
}
Object.assign(env, {
  NODE_ENV: "production", PORT: "5000", TRUST_PROXY: "1",
  SEED_DATABASE: "false", BOOTSTRAP_ADMIN: "false",
  CORS_ORIGINS: "https://businessexperts.asia,https://admin.businessexperts.asia,https://analytics.businessexperts.asia",
  PUBLIC_SITE_URL: "https://businessexperts.asia",
  ADMIN_SITE_URL: "https://admin.businessexperts.asia",
  AI_SITE_URL: "https://analytics.businessexperts.asia"
});
validateProductionConfig(env);
const contents = Object.entries(env).map(([key, value]) => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || /[\r\n]/.test(value)) {
    throw new Error("Review unsupported environment names or multiline values before transfer.");
  }
  return `${key}='${value.replaceAll("'", "\\'")}'`;
}).join("\n") + "\n";
writeFileSync(target, contents, { flag: "wx", mode: 0o600 });
console.log(`Prepared private production environment: ${target}`);
console.log("Existing database/provider settings preserved; no credentials printed or source files modified.");
if (replacedJwt) console.log("A strong JWT secret was generated for the NEW deployment because the source used a development/short secret. Existing sessions will require sign-in on the new deployment.");
