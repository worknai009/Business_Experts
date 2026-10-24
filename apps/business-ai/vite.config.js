import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const createProxyConfig = (target, rewritePath = null) => ({
  target,
  changeOrigin: true,
  ...(rewritePath ? { rewrite: (p) => p.replace(rewritePath, '') } : {}),
  configure: (proxy) => {
    proxy.on('error', (err, req, res) => {
      if (res && !res.headersSent) {
        try {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Service offline or restarting', detail: err?.code || 'ECONNREFUSED' }));
        } catch (e) {}
      }
    });
  },
});

const proxy = {
  "/api": createProxyConfig("http://127.0.0.1:5000"),
  "/ai-api": createProxyConfig("http://127.0.0.1:5000", /^\/ai-api/),
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy,
  },

  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
    proxy,
  },
});