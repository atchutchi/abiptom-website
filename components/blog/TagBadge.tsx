import Link from "next/link";
import { Tag } from "@/lib/types/blog";

interface TagBadgeProps {
  tag: Tag;
  className?: string;
}

export function TagBadge({ tag, className = "" }: TagBadgeProps) {
  return (
    <Link
      href={`/blog/tag/${tag.slug}`}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors ${className}`}
    >
      #{tag.name}
    </Link>
  );
} 