"use client";

import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import { Instagram, Telegram, Wallet } from "./icons";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 font-bold text-white">
                A
              </span>
              <span className="text-lg font-semibold text-white">
                Abdulrhman<span className="text-violet-400">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">{t("footer.tagline")}</p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={CONFIG.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-sky-500 hover:text-white"
                aria-label="Telegram"
              >
                <Telegram className="h-4 w-4" />
              </a>
              <a
                href={CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-gradient-to-br hover:from-fuchsia-500 hover:to-amber-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">{t("footer.quick")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white">{t("nav.services")}</a></li>
              <li><a href="#work" className="hover:text-white">{t("nav.work")}</a></li>
              <li><a href="#contact" className="hover:text-white">{t("nav.contact")}</a></li>
              <li><a href="/admin" className="hover:text-white">{t("nav.admin")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">{t("checkout.wallet")}</h4>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <Wallet className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
              <div className="text-xs text-slate-300">
                <div className="font-semibold text-emerald-300">USDT · {CONFIG.network}</div>
                <div className="mt-1 break-all font-mono text-[11px] text-slate-400">{CONFIG.wallet}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{t("footer.payments")}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {year} Abdulrhman. {t("footer.rights")}</p>
          <p className="text-xs">Built with Next.js · React · Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
