"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { TemplateDTO } from "@/lib/orders";
import { Package } from "./icons";
import TemplateCard from "./TemplateCard";

const filters = [
  { key: "work.all", value: "all" },
  { key: "work.website", value: "website" },
  { key: "work.template", value: "template" },
  { key: "work.app", value: "app" },
];

export default function Portfolio() {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");

  useEffect(() => {
    let alive = true;
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data: TemplateDTO[]) => alive && (setTemplates(data), setLoading(false)))
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const visible =
    active === "all" ? templates : templates.filter((tpl) => tpl.category === active);

  return (
    <section id="work" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            {t("work.kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t("work.title")}</h2>
          <p className="mt-4 text-slate-400">{t("work.subtitle")}</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                active === f.value
                  ? "bg-gradient-to-r from-violet-600 to-sky-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Package className="h-12 w-12 opacity-50" />
            <p>{t("work.empty")}</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tpl) => (
              <TemplateCard key={tpl.id} t={tpl} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
