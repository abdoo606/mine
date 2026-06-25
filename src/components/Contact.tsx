"use client";

import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import { ArrowRight, Instagram, Telegram } from "./icons";

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              {t("contact.kicker")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t("contact.title")}</h2>
            <p className="mt-4 text-slate-300">{t("contact.subtitle")}</p>
            <p className="mt-2 text-sm text-emerald-300">{t("contact.responseTime")}</p>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <a
              href={CONFIG.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <Telegram className="h-6 w-6" />
              </span>
              <div className="text-start">
                <div className="text-xs uppercase tracking-wide text-slate-400">{t("contact.telegram")}</div>
                <div className="font-semibold text-white">@{CONFIG.telegram}</div>
              </div>
              <ArrowRight className="ms-auto h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </a>

            <a
              href={CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white">
                <Instagram className="h-6 w-6" />
              </span>
              <div className="text-start">
                <div className="text-xs uppercase tracking-wide text-slate-400">{t("contact.instagram")}</div>
                <div className="font-semibold text-white">@{CONFIG.instagram}</div>
              </div>
              <ArrowRight className="ms-auto h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </a>
          </div>

          <div className="relative mt-8 text-center">
            <a
              href={CONFIG.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-7 py-3.5 font-semibold text-white"
            >
              <Telegram className="h-4 w-4" />
              {t("contact.telegramCta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
