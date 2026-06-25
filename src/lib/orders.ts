import { verifyUsdtPayment } from "./tron";

export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || "template";
}

export function generateReference(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${time}${rand}`;
}

export interface TemplateDTO {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string | null;
  demoUrl: string | null;
  fileUrl: string | null;
  tags: string[] | null;
  featured: boolean;
  live: boolean;
  createdAt: string | null;
}

export function serializeTemplate(t: {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  price: string;
  oldPrice: string | null;
  imageUrl: string | null;
  demoUrl: string | null;
  fileUrl: string | null;
  tags: string[] | null;
  featured: boolean | null;
  live: boolean | null;
  createdAt: Date | null;
}): TemplateDTO {
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    description: t.description,
    category: t.category,
    price: Number(t.price),
    oldPrice: t.oldPrice == null ? null : Number(t.oldPrice),
    imageUrl: t.imageUrl,
    demoUrl: t.demoUrl,
    fileUrl: t.fileUrl,
    tags: t.tags,
    featured: Boolean(t.featured),
    live: Boolean(t.live),
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : null,
  };
}

/** Run on-chain verification for a pending order and decide its next status. */
export async function attemptVerify(opts: {
  txid: string | null;
  amount: number;
  wallet: string;
  fileUrl: string | null;
  currentStatus: string;
}): Promise<{ status: string; note: string | null }> {
  const { txid, amount, wallet, fileUrl, currentStatus } = opts;
  if (currentStatus === "delivered") {
    return { status: "delivered", note: null };
  }
  if (!txid) {
    return { status: "pending", note: null };
  }
  // تحسين: جعل النظام يقبل الطلب حتى لو الـ API متأخر، مع وضع ملاحظة للمشرف
  try {
    const res = await verifyUsdtPayment(txid, amount, wallet);
    if (res.verified) {
      return {
        status: fileUrl ? "delivered" : "paid",
        note: res.amount != null ? `Auto-verified: ${res.amount} USDT received` : "Verified",
      };
    }
  } catch (e) {
    return { status: "pending", note: "Manual verification required" };
  }
  
  // في حال فشل التحقق التلقائي، نتركه معلقاً ليقوم عبد الرحمن بتفعيله يدوياً من لوحة التحكم
  return { status: "pending", note: "Awaiting manual confirmation or network sync" };
}
