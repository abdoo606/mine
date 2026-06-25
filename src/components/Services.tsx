"use client";

import { useI18n } from "@/i18n/provider";
import { ArrowRight, Globe, Layers, Rocket } from "./icons";

const items = [
  { key: "services.webTitle", desc: "services.webDesc", icon: Globe, color: "from-violet-500 to-fuchsia-500", price: "49" },
  { key: "services.codeTitle", desc: "services.codeDesc", icon: Layers, color: "from-sky-500 to-cyan-500", price: "19" },
  { key: "services.appTitle", desc: "services.appDesc", icon: Rocket, color: "from-emerald-500 to-teal-500", price: "99" },
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            {t("services.kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t("services.title")}</h2>
          <p className="mt-4 text-slate-400">{t("services.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(({ key, desc, icon: Icon, color, price }) => (
            <div
              key={key}
              className="card-hover glass group relative overflow-hidden rounded-3xl p-7"
            >
              <div
                className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">{t(key)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(desc)}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                <span className="text-sm text-slate-400">
                  {t("services.from")}{" "}
                  <span className="text-lg font-bold text-white">${price}</span>
                </span>
                <a
                  href="#work"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-violet-300 transition group-hover:bg-violet-500 group-hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
