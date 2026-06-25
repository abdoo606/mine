"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import PublicHeader from "@/components/PublicHeader";
import { Shield } from "@/components/icons";

export default function AdminLogin() {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin");
      router.refresh();
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto flex max-w-md flex-col items-center px-5 py-20">
        <div className="glass w-full rounded-3xl p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-white">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-center text-2xl font-bold text-white">{t("admin.loginTitle")}</h1>
          <p className="mt-2 text-center text-sm text-slate-400">{t("admin.loginSubtitle")}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">{t("admin.password")}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("admin.passwordPh")}
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </label>
            {error && (
              <p className="rounded-lg bg-rose-500/10 p-2.5 text-center text-sm text-rose-300">
                {t("admin.loginError")}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "..." : t("admin.loginBtn")}
            </button>
          </form>
        </div>
        <a href="/" className="mt-6 text-sm text-slate-500 hover:text-white">
          ← {t("common.backHome")}
        </a>
      </main>
    </div>
  );
}
