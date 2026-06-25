"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import type { TemplateDTO } from "@/lib/orders";
import { ArrowRight, Copy, QrCode, Shield, Wallet } from "./icons";

interface Props {
  template: TemplateDTO;
  qr: string;
  wallet: string;
  network: string;
}

export default function CheckoutForm({ template, qr, wallet, network }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [txid, setTxid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError(t("checkout.name") + " — required");
    if (!txid.trim()) return setError(t("checkout.txidLabel") + " — required");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          buyerName: name,
          buyerEmail: email,
          buyerTelegram: telegram,
          txid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(`/order/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Payment panel */}
      <div className="space-y-5">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t("checkout.orderSummary")}</h2>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
              {t(`work.${template.category}`)}
            </span>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">{t("checkout.template")}</div>
            <div className="mt-1 font-semibold text-white">{template.title}</div>
          </div>
          <div className="mt-4 flex items-end justify-between rounded-2xl bg-gradient-to-r from-violet-600/20 to-sky-500/20 p-4">
            <span className="text-sm text-slate-300">{t("checkout.amountDue")}</span>
            <span className="text-2xl font-bold text-white">
              {template.price.toFixed(2)} <span className="text-base text-emerald-400">USDT</span>
            </span>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold">{t("checkout.wallet")}</span>
          </div>
          <button
            onClick={() => copy(wallet, "wallet")}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-start transition hover:border-emerald-400/40"
          >
            <span className="break-all font-mono text-sm text-emerald-300">{wallet}</span>
            <span className="flex flex-none items-center gap-1 text-xs text-slate-400">
              <Copy className="h-3.5 w-3.5" />
              {copied === "wallet" ? t("checkout.copied") : t("checkout.copy")}
            </span>
          </button>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm">
            <span className="text-slate-300">{t("checkout.network")}</span>
            <span className="font-semibold text-amber-300">{network}</span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="rounded-2xl bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="USDT TRC20 payment QR" className="h-32 w-32" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <QrCode className="h-4 w-4 text-violet-400" />
                {t("checkout.qrTitle")}
              </div>
              <p className="mt-1 text-xs text-slate-400">{t("checkout.qrHint")}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl border-l-2 border-l-amber-400 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-amber-300">
            <Shield className="h-4 w-4" />
            {t("checkout.instructions")}
          </h3>
          <ol className="mt-3 space-y-2.5 text-sm text-slate-300">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex gap-2.5">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-amber-300">
                  {n}
                </span>
                {t(`checkout.step${n}`)}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Contact + TXID form */}
      <form onSubmit={submit} className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-emerald-300">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-medium">{t("checkout.secureNote")}</span>
        </div>

        <h2 className="mt-4 text-lg font-bold text-white">{t("checkout.contactInfo")}</h2>
        <div className="mt-4 space-y-3">
          <Field label={t("checkout.name")} placeholder={t("checkout.namePh")} value={name} onChange={setName} required />
          <Field label={t("checkout.email")} placeholder={t("checkout.emailPh")} value={email} onChange={setEmail} type="email" />
          <Field label={t("checkout.telegram")} placeholder={t("checkout.telegramPh")} value={telegram} onChange={setTelegram} />
        </div>

        <h2 className="mt-6 text-lg font-bold text-white">{t("checkout.txidLabel")}</h2>
        <Field
          label={t("checkout.txidLabel")}
          placeholder={t("checkout.txidPh")}
          value={txid}
          onChange={setTxid}
          required
          mono
        />

        {error && <p className="mt-3 rounded-lg bg-rose-500/10 p-2.5 text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? t("checkout.processing") : t("checkout.submit")}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">{t("checkout.usdtOnly")}</p>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  mono,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 ${
          mono ? "font-mono" : ""
        }`}
      />
    </label>
  );
}
