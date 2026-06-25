"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import type { TemplateDTO } from "@/lib/orders";
import {
  Check,
  Close,
  Edit,
  Logout,
  Package,
  Plus,
  Shield,
  Trash,
  Wallet,
} from "@/components/icons";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface OrderRow {
  id: number;
  reference: string;
  templateTitle: string | null;
  amount: number;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerTelegram: string | null;
  txid: string | null;
  status: string;
  note: string | null;
  createdAt: string | null;
  deliveredAt: string | null;
}

interface FormState {
  id?: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  oldPrice: string;
  imageUrl: string;
  demoUrl: string;
  fileUrl: string;
  tags: string;
  featured: boolean;
  live: boolean;
}

const EMPTY: FormState = {
  title: "",
  slug: "",
  description: "",
  category: "template",
  price: "",
  oldPrice: "",
  imageUrl: "",
  demoUrl: "",
  fileUrl: "",
  tags: "",
  featured: false,
  live: true,
};

const CATEGORIES = ["website", "template", "app", "service"];

export default function AdminDashboard() {
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const loadTemplates = useCallback(() => {
    fetch("/api/templates?all=1")
      .then((r) => r.json())
      .then((d: TemplateDTO[]) => setTemplates(d))
      .catch(() => setTemplates([]));
  }, []);

  const loadOrders = useCallback(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d: OrderRow[]) => setOrders(d))
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    Promise.all([loadTemplates(), loadOrders()]).finally(() => setLoading(false));
  }, [loadTemplates, loadOrders]);

  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.amount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  const openNew = () => {
    setForm(EMPTY);
    setShowForm(true);
  };
  const openEdit = (tpl: TemplateDTO) => {
    setForm({
      id: tpl.id,
      title: tpl.title,
      slug: tpl.slug,
      description: tpl.description ?? "",
      category: tpl.category,
      price: String(tpl.price),
      oldPrice: tpl.oldPrice != null ? String(tpl.oldPrice) : "",
      imageUrl: tpl.imageUrl ?? "",
      demoUrl: tpl.demoUrl ?? "",
      fileUrl: tpl.fileUrl ?? "",
      tags: (tpl.tags ?? []).join(", "),
      featured: tpl.featured,
      live: tpl.live,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      imageUrl: form.imageUrl,
      demoUrl: form.demoUrl,
      fileUrl: form.fileUrl,
      tags: form.tags,
      featured: form.featured,
      live: form.live,
    };
    if (form.id) {
      await fetch(`/api/templates/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    loadTemplates();
  };

  const remove = async (id: number) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    loadTemplates();
  };

  const setOrderStatus = async (ref: string, status: string) => {
    await fetch(`/api/orders/${ref}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  const verifyOrder = async (ref: string) => {
    await fetch(`/api/orders/${ref}`, { method: "POST" });
    loadOrders();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const catLabel = (c: string) => {
    const k = `work.${c}`;
    const tr = t(k);
    return tr === k ? c : tr;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070711]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 font-bold text-white">
              A
            </span>
            <span className="hidden font-semibold text-white sm:inline">
              {t("admin.dashboard")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link
              href="/"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {t("admin.viewSite")}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10"
            >
              <Logout className="h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Package className="h-5 w-5" />} value={templates.length} label={t("admin.statProducts")} tone="violet" />
          <StatCard icon={<Wallet className="h-5 w-5" />} value={revenue.toFixed(2)} label={t("admin.statRevenue")} tone="emerald" />
          <StatCard icon={<Shield className="h-5 w-5" />} value={orders.length} label={t("admin.statOrders")} tone="sky" />
          <StatCard icon={<Package className="h-5 w-5" />} value={pending} label={t("admin.statPending")} tone="amber" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <TabBtn active={tab === "products"} onClick={() => setTab("products")}>
              {t("admin.tabProducts")}
            </TabBtn>
            <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>
              {t("admin.tabOrders")} {orders.length > 0 && <span className="opacity-60">({orders.length})</span>}
            </TabBtn>
          </div>
          {tab === "products" && (
            <button
              onClick={openNew}
              className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.addNew")}</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : tab === "products" ? (
          templates.length === 0 ? (
            <EmptyState text={t("admin.noProducts")} />
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-3">{t("admin.colTitle")}</th>
                      <th className="px-4 py-3">{t("admin.colCategory")}</th>
                      <th className="px-4 py-3">{t("admin.colPrice")}</th>
                      <th className="px-4 py-3">{t("admin.colStatus")}</th>
                      <th className="px-4 py-3 text-end">{t("admin.colActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {templates.map((tpl) => (
                      <tr key={tpl.id} className="transition hover:bg-white/[0.03]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 flex-none overflow-hidden rounded-lg bg-slate-800">
                              {tpl.imageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={tpl.imageUrl} alt="" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">{tpl.title}</div>
                              {tpl.featured && (
                                <span className="text-xs text-amber-400">★ {t("admin.fldFeatured")}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{catLabel(tpl.category)}</td>
                        <td className="px-4 py-3 font-semibold text-white">${tpl.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {tpl.live ? (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300">live</span>
                          ) : (
                            <span className="rounded-full bg-slate-500/15 px-2.5 py-1 text-xs text-slate-400">draft</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <IconBtn onClick={() => openEdit(tpl)} title={t("admin.edit")} tone="sky">
                              <Edit className="h-4 w-4" />
                            </IconBtn>
                            <IconBtn onClick={() => remove(tpl.id)} title={t("admin.delete")} tone="rose">
                              <Trash className="h-4 w-4" />
                            </IconBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : orders.length === 0 ? (
          <EmptyState text={t("admin.noOrders")} />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3">{t("admin.colRef")}</th>
                    <th className="px-4 py-3">{t("admin.colBuyer")}</th>
                    <th className="px-4 py-3">{t("admin.colAmount")}</th>
                    <th className="px-4 py-3">{t("admin.colTxid")}</th>
                    <th className="px-4 py-3">{t("admin.colStatus")}</th>
                    <th className="px-4 py-3 text-end">{t("admin.colActions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="align-top transition hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-slate-200">{o.reference}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{o.templateTitle ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>{o.buyerName ?? "—"}</div>
                        <div className="text-xs text-slate-500">{o.buyerEmail ?? o.buyerTelegram ?? ""}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">{o.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {o.txid ? (
                          <a
                            href={`https://tronscan.org/#/transaction/${o.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-sky-400 hover:underline"
                            title={o.txid}
                          >
                            {o.txid.slice(0, 10)}…
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {o.status === "pending" && (
                            <MiniBtn onClick={() => verifyOrder(o.reference)}>{t("admin.verify")}</MiniBtn>
                          )}
                          {o.status === "pending" && (
                            <MiniBtn onClick={() => setOrderStatus(o.reference, "paid")}>{t("admin.markPaid")}</MiniBtn>
                          )}
                          {o.status !== "delivered" && o.status !== "cancelled" && (
                            <MiniBtn tone="emerald" onClick={() => setOrderStatus(o.reference, "delivered")}>
                              {t("admin.markDelivered")}
                            </MiniBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Template form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8">
          <div className="glass my-auto w-full max-w-2xl rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {form.id ? t("admin.editProduct") : t("admin.newProduct")}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <Close className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t("admin.fldTitle")} value={form.title} onChange={(v) => setForm({ ...form, title: v })} ph={t("admin.fldTitlePh")} required />
                <Input label={t("admin.fldSlug")} value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} ph={t("admin.fldSlugPh")} />
                <Input label={t("admin.fldPrice")} type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} ph="0.00" required />
                <Input label={t("admin.fldOldPrice")} type="number" value={form.oldPrice} onChange={(v) => setForm({ ...form, oldPrice: v })} ph="0.00" />
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">{t("admin.fldDescription")}</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">{t("admin.fldCategory")}</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {catLabel(c)}
                      </option>
                    ))}
                  </select>
                </label>
                <Input label={t("admin.fldTags")} value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} ph="react, nextjs, saas" />
                <Input label={t("admin.fldImage")} value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} ph="https://..." />
                <Input label={t("admin.fldDemo")} value={form.demoUrl} onChange={(v) => setForm({ ...form, demoUrl: v })} ph="https://..." />
              </div>
              <Input label={t("admin.fldFile")} value={form.fileUrl} onChange={(v) => setForm({ ...form, fileUrl: v })} ph="https://... (download link buyers receive)" />
              <div className="flex flex-wrap gap-5 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 accent-violet-500"
                  />
                  {t("admin.fldFeatured")}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.live}
                    onChange={(e) => setForm({ ...form, live: e.target.checked })}
                    className="h-4 w-4 accent-violet-500"
                  />
                  {t("admin.fldLive")}
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-glow flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-3 font-semibold text-white"
                >
                  <Check className="h-4 w-4" />
                  {t("admin.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 hover:bg-white/10"
                >
                  {t("admin.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tone: "violet" | "emerald" | "sky" | "amber";
}) {
  const tones = {
    violet: "from-violet-500/20 to-violet-500/5 text-violet-300",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
    sky: "from-sky-500/20 to-sky-500/5 text-sky-300",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-300",
  };
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tones[tone]}`}>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active ? "bg-gradient-to-r from-violet-600 to-sky-500 text-white" : "text-slate-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  tone: "sky" | "rose";
}) {
  const tones = { sky: "hover:bg-sky-500 hover:text-white", rose: "hover:bg-rose-500 hover:text-white" };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function MiniBtn({
  children,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "default" | "emerald";
}) {
  const tones = {
    default: "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
    emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-300",
    paid: "bg-sky-500/15 text-sky-300",
    delivered: "bg-emerald-500/15 text-emerald-300",
    cancelled: "bg-rose-500/15 text-rose-300",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? map.pending}`}>{status}</span>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-slate-500">
      <Package className="h-12 w-12 opacity-50" />
      <p>{text}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  ph,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ph?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
      />
    </label>
  );
}
