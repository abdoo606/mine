"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import LanguageSwitcher from "./LanguageSwitcher";
import { Telegram } from "./icons";

export default function PublicHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070711]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 font-bold text-white">
            A
          </span>
          <span className="text-lg font-semibold text-white">
            Abdulrhman<span className="text-violet-400">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <a
            href={CONFIG.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-sky-500 hover:text-white"
            aria-label="Telegram"
          >
            <Telegram className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
