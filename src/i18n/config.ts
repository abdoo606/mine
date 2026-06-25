export type Lang = "en" | "ar" | "es" | "fr" | "zh" | "hi";

export interface LangMeta {
  code: Lang;
  label: string; // native name
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LangMeta[] = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
];

export const DEFAULT_LANG: Lang = "en";

export function getLangMeta(code: Lang): LangMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isRTL(code: Lang): boolean {
  return getLangMeta(code).dir === "rtl";
}
