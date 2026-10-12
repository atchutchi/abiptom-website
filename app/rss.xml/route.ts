import { generateRSSFeed } from "@/lib/utils/blog";
import { NextResponse } from "next/server";
import { publishedBlogPosts } from "@/lib/data/published-blog-posts";

export async function GET() {
  const rss = generateRSSFeed(publishedBlogPosts);

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
