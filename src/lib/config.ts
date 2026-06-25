/**
 * Central site configuration — contact links, wallet, branding.
 * The USDT (TRC20) wallet below is where every payment lands directly.
 */
export const CONFIG = {
  devName: "Abdulrhman",
  devNameFull: "Abdulrhman",
  role: "ITE Engineer & UI/UX Expert",
  tagline: "ITE Engineer specialized in Full-Stack Development & Certified UI/UX Designer.",

  telegram: "Abdulrhman0985",
  telegramUrl: "https://t.me/Abdulrhman0985",

  instagram: "abdulrhmann",
  instagramUrl: "https://instagram.com/abdulrhmann",
  avatarUrl: "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/abdulrhman.jpg", // سأقوم بمحاولة استخدام رابط مباشر آخر أو تضمينها كـ base64 إذا استمرت المشكلة

  email: "",

  // Payments — USDT only, TRC20 network, funds go straight to this wallet.
  wallet: "TQ8599AiSX5DFW8NAmjuE5C6yCC5iWfRED",
  network: "TRC20 (Tron)",
  currency: "USDT",
  // USDT TRC20 contract on Tron mainnet.
  usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  decimals: 6,
} as const;
