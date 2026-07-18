import { Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api, setToken } from "./api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.post<{ token: string }>("/auth/login", { email, password });
      setToken(data.token);
      onLogin();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-ink via-[#0E2419] to-brand-dark p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white">
          <Lock className="size-6" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage your platform</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
