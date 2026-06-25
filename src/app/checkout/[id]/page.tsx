import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { CONFIG } from "@/lib/config";
import { serializeTemplate } from "@/lib/orders";
import PublicHeader from "@/components/PublicHeader";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params;
  const [row] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, Number(id)))
    .limit(1);

  if (!row || !row.live) notFound();

  const template = serializeTemplate(row);
  const qr = await QRCode.toDataURL(CONFIG.wallet, {
    margin: 1,
    width: 280,
    color: { dark: "#0b0b18", light: "#ffffff" },
  });

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            USDT · {CONFIG.network}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{CONFIG.devName} — Checkout</h1>
          <p className="mt-2 text-slate-400">{template.title}</p>
        </div>
        <CheckoutForm template={template} qr={qr} wallet={CONFIG.wallet} network={CONFIG.network} />
      </main>
    </div>
  );
}
