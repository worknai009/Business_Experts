import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import { validateProductionConfig } from "../backend/src/productionConfig.js";

const root = new URL("../", import.meta.url);
const target = new URL(".env", root);
if (process.argv.includes("--check")) {
  if (!existsSync(target)) throw new Error("Missing root .env. Run deploy/init-env.mjs first.");
  const env = parseEnv(readFileSync(target, "utf8"));
  const existing = process.argv.includes("--existing");
  if (existing && !/^mongodb(?:\+srv)?:\/\//.test(env.MONGODB_URI || "")) {
    throw new Error("Existing deployment requires the current live MONGODB_URI; no new database will be substituted.");
  }
  if (!existing && !/^[A-Za-z0-9_-]{32,72}$/.test(env.MONGO_ROOT_PASSWORD || "")) {
    throw new Error("MONGO_ROOT_PASSWORD must be 32 to 72 URL-safe characters.");
  }
  validateProductionConfig({
    ...env,
    NODE_ENV: "production",
    ...(existing ? { BOOTSTRAP_ADMIN: "false" } : {}),
    MONGODB_URI: env.MONGODB_URI || "mongodb://be-mongo:27017/business_experts",
    CORS_ORIGINS: "https://businessexperts.asia,https://admin.businessexperts.asia,https://analytics.businessexperts.asia"
  });
  console.log("Production environment validation passed.");
} else if (existsSync(target)) {
  console.log("Root .env already exists; existing settings were preserved.");
} else {
  let template = readFileSync(new URL(".env.example", root), "utf8");
  template = template.replace("replace-with-random-hex-password", randomBytes(32).toString("hex"));
  template = template.replace("replace-with-random-jwt-secret", randomBytes(48).toString("hex"));
  template = template.replace("replace-with-strong-admin-password", randomBytes(24).toString("hex"));
  writeFileSync(target, template, { mode: 0o600, flag: "wx" });
  console.log(`Created ${fileURLToPath(target)} with random MongoDB, JWT and admin secrets. Read/edit it privately before deployment.`);
}
