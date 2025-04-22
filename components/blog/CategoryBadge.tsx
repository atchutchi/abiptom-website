import Link from "next/link";
import { Category } from "@/lib/types/blog";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  return (
    <Link
      href={`/blog/categoria/${category.slug}`}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors ${className}`}
    >
      {category.name}
    </Link>
  );
} 