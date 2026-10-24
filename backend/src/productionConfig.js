export function validateProductionConfig(env = process.env) {
  if (env.NODE_ENV !== "production") return;
  if (!env.MONGODB_URI) throw new Error("MONGODB_URI is required in production.");
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || /change-me|dev-secret/i.test(env.JWT_SECRET)) {
    throw new Error("JWT_SECRET must be a random secret of at least 32 characters.");
  }
  const checkPassword = (password, label) => {
    if (!password || password.length < 16 || Buffer.byteLength(password, "utf8") > 72 ||
        /^(admin123|Admin@BusinessAI2026|change-me|replace)/i.test(password)) {
      throw new Error(`${label} must be a strong password of 16 to 72 bytes.`);
    }
  };
  if (env.BOOTSTRAP_ADMIN !== "false") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.ADMIN_EMAIL || "")) {
      throw new Error("ADMIN_EMAIL must be a valid email in production.");
    }
    checkPassword(env.ADMIN_PASSWORD, "ADMIN_PASSWORD");
    if (env.SUPERADMIN_EMAIL || env.SUPERADMIN_PASSWORD) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.SUPERADMIN_EMAIL || "")) {
        throw new Error("SUPERADMIN_EMAIL must be a valid email.");
      }
      checkPassword(env.SUPERADMIN_PASSWORD, "SUPERADMIN_PASSWORD");
    }
  }
  if (!env.CORS_ORIGINS) throw new Error("CORS_ORIGINS is required in production.");
}
