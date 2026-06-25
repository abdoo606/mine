"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import PublicHeader from "@/components/PublicHeader";
import { ArrowRight, Check, Package, Telegram } from "@/components/icons";

interface OrderData {
  reference: string;
  status: string;
  amount: number;
  templateTitle: string | null;
  fileUrl: string | null;
  note: string | null;
  createdAt: string | null;
  deliveredAt: string | null;
}

const statusStyle: Record<string, { dot: string; text: string; bg: string }> = {
  pending: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10" },
  paid: { dot: "bg-sky-400", text: "text-sky-300", bg: "bg-sky-400/10" },
  delivered: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10" },
  cancelled: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-400/10" },
};

export default function OrderPage() {
  const params = useParams<{ ref: string }>();
  const ref = params.ref;
  const { t } = useI18n();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);

  const load = () => {
    fetch(`/api/orders/${ref}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: OrderData) => setOrder(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const poll = setInterval(load, 15000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const verify = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/orders/${ref}`, { method: "POST" });
      const d = (await res.json()) as OrderData;
      setOrder(d);
    } finally {
      setVerifying(false);
    }
  };

  const statusLabel = (s: string) => t(`order.${s}`);
  const style = order ? statusStyle[order.status] ?? statusStyle.pending : statusStyle.pending;

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        {loading ? (
          <div className="glass h-64 animate-pulse rounded-3xl" />
        ) : error || !order ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-slate-300">{t("order.notFound")}</p>
            <a href="/" className="mt-4 inline-block text-violet-400 hover:underline">
              {t("common.backHome")}
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            <div className={`glass rounded-3xl p-7 ${style.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-400">{t("order.ref")}</span>
                <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${style.text} ${style.bg}`}>
                  <span className={`h-2 w-2 rounded-full ${style.dot} ${order.status === "pending" ? "animate-pulse" : ""}`} />
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="mt-2 font-mono text-sm text-slate-200">{order.reference}</div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
                <div>
                  <div className="text-slate-400">{t("order.amount")}</div>
                  <div className="mt-1 font-semibold text-white">{order.amount.toFixed(2)} USDT</div>
                </div>
                <div>
                  <div className="text-slate-400">{t("order.template")}</div>
                  <div className="mt-1 font-semibold text-white">{order.templateTitle ?? "—"}</div>
                </div>
              </div>
            </div>

            {/* Status message */}
            {order.status === "delivered" ? (
              <div className="glass rounded-3xl border-emerald-400/30 p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-bold text-white">{t("order.deliveredMsg")}</h2>
                  </div>
                </div>
                {order.fileUrl && (
                  <a
                    href={order.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 font-semibold text-white"
                  >
                    <Package className="h-5 w-5" />
                    {t("order.downloadFile")}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ) : order.status === "paid" ? (
              <Notice tone="sky">{t("order.paidMsg")}</Notice>
            ) : (
              <Notice tone="amber">{t("order.pendingMsg")}</Notice>
            )}

            {order.note && (
              <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-xs text-slate-400">
                {order.note}
              </p>
            )}

            {/* Actions */}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button
                onClick={verify}
                disabled={verifying}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                {verifying ? t("order.verifying") : t("order.verifyBtn")}
              </button>
            )}

            <a
              href={CONFIG.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <Telegram className="h-4 w-4" />
              {t("order.contactSupport")}
            </a>

            <p className="text-center text-xs text-slate-500">{t("order.copyRef")}</p>
          </div>
        )}
      </main>
    </div>
  );
}

function Notice({ tone, children }: { tone: "amber" | "sky"; children: React.ReactNode }) {
  const cls = tone === "amber" ? "border-amber-400/30 bg-amber-400/5 text-amber-200" : "border-sky-400/30 bg-sky-400/5 text-sky-200";
  return <div className={`glass rounded-3xl border p-7 text-center text-sm ${cls}`}>{children}</div>;
}
