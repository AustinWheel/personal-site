import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content/blog");

function ensureBlogDir() {
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }
}

// GET /api/blog — list all posts
export async function GET() {
  ensureBlogDir();
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(blogDir, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json(posts);
}

// POST /api/blog — create or update a post (dev only)
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  ensureBlogDir();

  const body = await req.json();
  const { slug, title, date, content } = body;

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Prevent path traversal
  const safeSlug = path.basename(slug);
  if (safeSlug !== slug || slug.includes("..")) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const frontmatter = `---\ntitle: ${title}\ndate: "${date || new Date().toISOString().split("T")[0]}"\n---\n\n`;
  const filePath = path.join(blogDir, `${safeSlug}.md`);

  fs.writeFileSync(filePath, frontmatter + content, "utf-8");

  return NextResponse.json({ slug: safeSlug });
}
