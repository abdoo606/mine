"use client";

import { useI18n } from "@/i18n/provider";
import { CONFIG } from "@/lib/config";
import { Check, Code } from "./icons";

export default function About() {
  const { t } = useI18n();
  const features = [
    "about.feature1",
    "about.feature2",
    "about.feature3",
    "about.feature4",
  ];
  const stack = ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind", "Drizzle", "UI/UX"];

  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              {t("about.kicker")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t("about.title")}</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">{t("about.p1")}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-400">{t("about.p2")}</p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t(f)}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass relative overflow-hidden rounded-[2.5rem] p-2">
              <div className="relative aspect-square overflow-hidden rounded-[2rem]">
                <img 
                  src="https://r.jina.ai/i/0582524a1322475f82216656c152345e" 
                  alt="Abdulrhman" 
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070711] via-transparent to-transparent opacity-60" />
                
                {/* floating badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-2xl bg-black/60 p-4 backdrop-blur-md border border-white/10">
                     <div className="flex items-center gap-2">
                        <div className="flex h-2 w-2">
                          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-white">ITE Engineer & UI/UX Expert</span>
                     </div>
                     <div className="mt-1 text-[11px] text-slate-300">Certified professional bridging design and engineering.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  <Code className="h-3.5 w-3.5 text-violet-400" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
