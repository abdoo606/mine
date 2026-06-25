import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, templates } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { attemptVerify } from "@/lib/orders";

export const dynamic = "force-dynamic";

interface RouteCtx {
  params: Promise<{ ref: string }>;
}

function publicOrder(
  o: typeof orders.$inferSelect,
  fileUrl: string | null,
) {
  return {
    reference: o.reference,
    status: o.status,
    amount: Number(o.amount),
    templateTitle: o.templateTitle,
    templateId: o.templateId,
    wallet: o.wallet,
    note: o.note,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
    deliveredAt: o.deliveredAt ? new Date(o.deliveredAt).toISOString() : null,
    // Only expose the download link once the order is delivered.
    fileUrl: o.status === "delivered" ? fileUrl : null,
  };
}

async function fetchOrder(ref: string) {
  const [row] = await db
    .select({ order: orders, template: templates })
    .from(orders)
    .leftJoin(templates, eq(orders.templateId, templates.id))
    .where(eq(orders.reference, ref))
    .limit(1);
  return row;
}

/** Public: check an order's status (download link hidden unless delivered). */
export async function GET(_req: Request, { params }: RouteCtx) {
  const { ref } = await params;
  const row = await fetchOrder(ref);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(publicOrder(row.order, row.template?.fileUrl ?? null));
}

/** Public: re-run on-chain verification for a pending order. */
export async function POST(_req: Request, { params }: RouteCtx) {
  const { ref } = await params;
  const row = await fetchOrder(ref);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const verify = await attemptVerify({
    txid: row.order.txid,
    amount: Number(row.order.amount),
    wallet: CONFIG.wallet,
    fileUrl: row.template?.fileUrl ?? null,
    currentStatus: row.order.status,
  });
  const patch: Record<string, unknown> = { status: verify.status, note: verify.note };
  if (verify.status === "delivered") patch.deliveredAt = new Date();
  if (verify.status !== row.order.status || verify.note !== row.order.note) {
    await db.update(orders).set(patch).where(eq(orders.id, row.order.id));
  }

  const [updated] = await db.select().from(orders).where(eq(orders.id, row.order.id)).limit(1);
  return NextResponse.json(
    publicOrder(updated!, row.template?.fileUrl ?? null),
  );
}

/** Admin: manually set the order status (e.g. mark delivered). */
export async function PATCH(req: Request, { params }: RouteCtx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ref } = await params;
  const { status } = await req.json();
  if (!["pending", "paid", "delivered", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const patch: Record<string, unknown> = { status };
  if (status === "delivered") patch.deliveredAt = new Date();
  await db.update(orders).set(patch).where(eq(orders.reference, ref));
  return NextResponse.json({ ok: true });
}
