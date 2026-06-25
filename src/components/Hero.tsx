"use client";

import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import { ArrowRight, Sparkles, Telegram } from "./icons";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070711]/60 via-[#070711]/80 to-[#070711]" />
      </div>
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl animate-blob [animation-delay:3s]" />

      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t("hero.badge")}
          </div>

          <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl [animation-delay:80ms]">
            {t("hero.title")}
            <br />
            <span className="gradient-text">{t("hero.titleAccent")}</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg [animation-delay:160ms]">
            {t("hero.subtitle")}
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
            <a
              href="#work"
              className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-7 py-3.5 font-semibold text-white sm:w-auto"
            >
              {t("hero.ctaWork")}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={CONFIG.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              <Telegram className="h-4 w-4" />
              {t("hero.ctaContact")}
            </a>
          </div>

          <div className="animate-fade-up mt-14 grid grid-cols-3 gap-4 [animation-delay:320ms]">
            {[
              { num: t("hero.stat1Num"), label: t("hero.stat1Label") },
              { num: t("hero.stat2Num"), label: t("hero.stat2Label") },
              { num: t("hero.stat3Num"), label: t("hero.stat3Label") },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-3 py-4">
                <div className="text-2xl font-bold gradient-text sm:text-3xl">{s.num}</div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up mt-16 flex items-center justify-center gap-2 text-xs text-slate-400 [animation-delay:400ms]">
          <Sparkles className="h-4 w-4 text-violet-400" />
          {t("footer.payments")}
        </div>
      </div>
    </section>
  );
}
