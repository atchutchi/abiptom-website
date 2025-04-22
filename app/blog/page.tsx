"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { TagBadge } from "@/components/blog/TagBadge";
import { Pagination } from "@/components/blog/Pagination";
import { BlogPost } from "@/lib/types/blog";
import {
  searchPosts,
  filterPostsByCategory,
  filterPostsByTag,
  paginatePosts,
  getAllCategories,
  getAllTags,
} from "@/lib/utils/blog";
import Link from "next/link";
import Image from "next/image";

// This would typically come from your database or CMS
const getPosts = async (): Promise<BlogPost[]> => {
  // For now, return an empty array
  // You'll need to implement this to fetch your actual blog posts
  return [];
};

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState(getAllCategories([]));
  const [tags, setTags] = useState(getAllTags([]));
  const [currentPage, setCurrentPage] = useState(1);

  const category = searchParams.get("categoria");
  const tag = searchParams.get("tag");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPosts();
      setPosts(allPosts);
      setCategories(getAllCategories(allPosts));
      setTags(getAllTags(allPosts));
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    if (category) {
      filtered = filterPostsByCategory(filtered, category);
    }

    if (tag) {
      filtered = filterPostsByTag(filtered, tag);
    }

    if (search) {
      filtered = searchPosts(filtered, search);
    }

    setFilteredPosts(filtered);
    setCurrentPage(page);
  }, [posts, category, tag, search, page]);

  const { posts: paginatedPosts, pagination } = paginatePosts(filteredPosts, currentPage);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">
              Blog ABIPTOM
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Insights, notícias e cases de sucesso sobre design, desenvolvimento web e marketing digital.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Sidebar */}
            <div className="space-y-8">
              <div>
                <BlogSearch onSearch={handleSearch} />
              </div>
              
              <div>
                <h3 className="font-bauhaus text-lg mb-4">Categorias</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <CategoryBadge key={cat.id} category={cat} className="mr-2 mb-2" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bauhaus text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="md:col-span-3">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <article key={post.id} className="group">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="space-x-2">
                          {post.categories.map((cat) => (
                            <CategoryBadge key={cat.id} category={cat} className="mr-2" />
                          ))}
                        </div>
                        <h2 className="text-xl font-bold font-bauhaus">{post.title}</h2>
                        <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.readingTime}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
