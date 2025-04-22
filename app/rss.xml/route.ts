import { generateRSSFeed } from "@/lib/utils/blog";
import { BlogPost } from "@/lib/types/blog";
import { NextResponse } from "next/server";

// This would typically come from your database or CMS
const getPosts = async (): Promise<BlogPost[]> => {
  // For now, return an empty array
  // You'll need to implement this to fetch your actual blog posts
  return [];
};

export async function GET() {
  const posts = await getPosts();
  const rss = generateRSSFeed(posts);

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
} 