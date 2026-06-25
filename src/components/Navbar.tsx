"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import LanguageSwitcher from "./LanguageSwitcher";
import { Close, Menu, Telegram } from "./icons";

const links = [
  { key: "nav.home", href: "#home" },
  { key: "nav.services", href: "#services" },
  { key: "nav.work", href: "#work" },
  { key: "nav.contact", href: "#contact" },
];

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-[#070711]/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <a href="#home" className="group flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 shadow-lg transition-transform group-hover:scale-105">
            <img src="https://r.jina.ai/i/0582524a1322475f82216656c152345e" alt="Abdulrhman" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Abdulrhman<span className="text-violet-400">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href={CONFIG.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 sm:flex"
          >
            <Telegram className="h-4 w-4" />
            {t("hero.ctaContact")}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
            aria-label="Menu"
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#070711]/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {t(l.key)}
              </a>
            ))}
            <a
              href={CONFIG.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-sky-500 px-3 py-2.5 text-sm font-semibold text-white"
            >
              <Telegram className="h-4 w-4" />
              {t("hero.ctaContact")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
