"use client";

import { useI18n } from "@/i18n/provider";
import type { TemplateDTO } from "@/lib/orders";
import { ArrowRight, Package, Sparkles } from "./icons";

export default function TemplateCard({ t: tpl }: { t: TemplateDTO }) {
  const { t } = useI18n();
  const categoryLabel = t(`work.${tpl.category}`);
  const discount =
    tpl.oldPrice && tpl.oldPrice > tpl.price
      ? Math.round((1 - tpl.price / tpl.oldPrice) * 100)
      : 0;

  return (
    <div className="card-hover glass group flex flex-col overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        {tpl.imageUrl ? (
          <img
            src={tpl.imageUrl}
            alt={tpl.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/30 to-sky-500/20">
            <Package className="h-12 w-12 text-white/40" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {categoryLabel}
          </span>
          {tpl.featured && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-bold text-white">
              <Sparkles className="h-3 w-3" />
              {t("work.featured")}
            </span>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute bottom-3 start-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white">{tpl.title}</h3>
        {tpl.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{tpl.description}</p>
        )}

        {tpl.tags && tpl.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tpl.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-end justify-between">
          <div>
            {tpl.oldPrice && tpl.oldPrice > tpl.price && (
              <div className="text-xs text-slate-500 line-through">
                ${tpl.oldPrice.toFixed(2)}
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">${tpl.price.toFixed(2)}</span>
              <span className="text-xs font-medium text-emerald-400">USDT</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <a
            href={`/checkout/${tpl.id}`}
            className="btn-glow flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            {t("work.buy")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {tpl.demoUrl && (
            <a
              href={tpl.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              {t("work.viewDemo")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
