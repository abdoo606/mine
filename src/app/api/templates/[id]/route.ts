import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, templates } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { serializeTemplate, slugify } from "@/lib/orders";

export const dynamic = "force-dynamic";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

/** Admin: update a template. */
export async function PUT(req: Request, { params }: RouteCtx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const price = Number(body.price);
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

  const [updated] = await db
    .update(templates)
    .set({
      title,
      slug: String(body.slug ?? slugify(title)),
      description: body.description ? String(body.description) : null,
      category: String(body.category ?? "template"),
      price: price.toFixed(2),
      oldPrice: body.oldPrice ? Number(body.oldPrice).toFixed(2) : null,
      imageUrl: body.imageUrl ? String(body.imageUrl) : null,
      demoUrl: body.demoUrl ? String(body.demoUrl) : null,
      fileUrl: body.fileUrl ? String(body.fileUrl) : null,
      tags,
      featured: Boolean(body.featured),
      live: body.live !== false,
      updatedAt: new Date(),
    })
    .where(eq(templates.id, Number(id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeTemplate(updated));
}

/** Admin: delete a template (keeps order history by nulling the FK). */
export async function DELETE(_req: Request, { params }: RouteCtx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);

  await db.transaction(async (tx) => {
    await tx.update(orders).set({ templateId: null }).where(eq(orders.templateId, numId));
    await tx.delete(templates).where(eq(templates.id, numId));
  });
  return NextResponse.json({ ok: true });
}
