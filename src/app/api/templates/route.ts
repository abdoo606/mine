import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { serializeTemplate, slugify } from "@/lib/orders";

export const dynamic = "force-dynamic";

/** Public: list published templates. Admin can request all with ?all=1. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeAll = url.searchParams.get("all") === "1" && (await isAdmin());
  const rows = await db
    .select()
    .from(templates)
    .orderBy(desc(templates.featured), desc(templates.createdAt));
  const out = includeAll ? rows : rows.filter((r) => r.live);
  return NextResponse.json(out.map(serializeTemplate));
}

/** Admin: create a new template. */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

  const [created] = await db
    .insert(templates)
    .values({
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
    })
    .returning();

  return NextResponse.json(serializeTemplate(created!), { status: 201 });
}
