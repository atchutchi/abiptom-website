import { generateRSSFeed } from "@/lib/utils/blog";
import { NextResponse } from "next/server";
import { projectBlogPosts } from "@/lib/data/project-blog-posts";

export async function GET() {
  const rss = generateRSSFeed(projectBlogPosts);

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
