import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, templates } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { attemptVerify, generateReference } from "@/lib/orders";

export const dynamic = "force-dynamic";

/** Admin: list every order. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(orders).orderBy(orders.id);
  return NextResponse.json(
    rows.map((o) => ({
      id: o.id,
      reference: o.reference,
      templateId: o.templateId,
      templateTitle: o.templateTitle,
      amount: Number(o.amount),
      wallet: o.wallet,
      buyerName: o.buyerName,
      buyerEmail: o.buyerEmail,
      buyerTelegram: o.buyerTelegram,
      txid: o.txid,
      status: o.status,
      note: o.note,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
      deliveredAt: o.deliveredAt ? new Date(o.deliveredAt).toISOString() : null,
    })),
  );
}

/** Public: create an order from the checkout flow and attempt verification. */
export async function POST(req: Request) {
  const body = await req.json();
  const templateId = Number(body.templateId);
  if (!Number.isFinite(templateId)) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  const [template] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);
  if (!template || !template.live) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const amount = Number(template.price);
  const reference = generateReference();
  const txid = body.txid ? String(body.txid).trim() : null;

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      templateId: template.id,
      templateTitle: template.title,
      amount: amount.toFixed(2),
      wallet: CONFIG.wallet,
      buyerName: body.buyerName ? String(body.buyerName) : null,
      buyerEmail: body.buyerEmail ? String(body.buyerEmail) : null,
      buyerTelegram: body.buyerTelegram ? String(body.buyerTelegram) : null,
      txid,
      status: "pending",
    })
    .returning();

  // Attempt automatic on-chain verification right away.
  try {
    const verify = await attemptVerify({
      txid,
      amount,
      wallet: CONFIG.wallet,
      fileUrl: template.fileUrl,
      currentStatus: "pending",
    });
    const patch: Record<string, unknown> = { status: verify.status, note: verify.note };
    if (verify.status === "delivered") patch.deliveredAt = new Date();
    await db.update(orders).set(patch).where(eq(orders.id, order!.id));
  } catch (e) {
    // If auto-verify fails, keep it as pending for manual review
    await db.update(orders).set({ note: "Auto-verification failed. Admin will review manually." }).where(eq(orders.id, order!.id));
  }

  const [final] = await db.select().from(orders).where(eq(orders.id, order!.id)).limit(1);
  return NextResponse.json({ reference: final!.reference, status: final!.status }, { status: 201 });
}
