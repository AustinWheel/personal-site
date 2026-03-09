import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content/blog");

// GET /api/blog/[slug] — read a single post
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safeSlug = path.basename(slug);
  const filePath = path.join(blogDir, `${safeSlug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return NextResponse.json({
    slug: safeSlug,
    title: data.title || safeSlug,
    date: data.date || "",
    content,
  });
}

// DELETE /api/blog/[slug] — delete a post (dev only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { slug } = await params;
  const safeSlug = path.basename(slug);
  const filePath = path.join(blogDir, `${safeSlug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ deleted: safeSlug });
}
