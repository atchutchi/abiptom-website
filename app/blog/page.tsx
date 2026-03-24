"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { BlogSearch } from "@/components/blog/BlogSearch"
import { CategoryBadge } from "@/components/blog/CategoryBadge"
import { TagBadge } from "@/components/blog/TagBadge"
import { Pagination } from "@/components/blog/Pagination"
import { BlogPost } from "@/lib/types/blog"
import {
  searchPosts,
  filterPostsByCategory,
  filterPostsByTag,
  paginatePosts,
  getAllCategories,
  getAllTags,
} from "@/lib/utils/blog"
import Link from "next/link"
import Image from "next/image"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { PageTransition } from "@/components/page-transition"

const getPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.abiptom.gw"}/api/blog/posts`,
      { cache: "no-store", next: { revalidate: 0 } }
    )
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

const BlogContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState(getAllCategories([]))
  const [tags, setTags] = useState(getAllTags([]))
  const [currentPage, setCurrentPage] = useState(1)

  const category = searchParams.get("categoria")
  const tag = searchParams.get("tag")
  const search = searchParams.get("q")
  const page = parseInt(searchParams.get("page") || "1")

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPosts()
      setPosts(allPosts)
      setCategories(getAllCategories(allPosts))
      setTags(getAllTags(allPosts))
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = [...posts]
    if (category) filtered = filterPostsByCategory(filtered, category)
    if (tag) filtered = filterPostsByTag(filtered, tag)
    if (search) filtered = searchPosts(filtered, search)
    setFilteredPosts(filtered)
    setCurrentPage(page)
  }, [posts, category, tag, search, page])

  const { posts: paginatedPosts, pagination } = paginatePosts(filteredPosts, currentPage)

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) params.set("q", query)
    else params.delete("q")
    params.set("page", "1")
    router.push(`/blog?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <section className="section-padding bg-obys-dark">
      <div className="obys-container--wide mx-auto px-6 lg:px-10">
        {/* Search */}
        <div className="mb-16 max-w-2xl">
          <BlogSearch onSearch={handleSearch} />
        </div>

        <div className="grid gap-12 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-label text-obys-text-muted mb-4">Categorias</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} className="mr-2 mb-2" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-label text-obys-text-muted mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <TagBadge key={t.id} tag={t} />
                ))}
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="lg:col-span-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="body-base text-obys-text-muted">Nenhum post encontrado.</p>
              </div>
            ) : (
              <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <article key={post.id} className="group">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="border border-obys-border-dark hover:border-obys-gold transition-colors duration-obys bg-obys-near-black overflow-hidden">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-obys-default group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex gap-2 mb-3">
                            {post.categories.map((cat) => (
                              <span key={cat.id} className="text-xs text-obys-gold uppercase tracking-wider">
                                {cat.name}
                              </span>
                            ))}
                          </div>
                          <h2 className="font-display text-lg text-white mb-3 group-hover:text-obys-gold transition-colors duration-obys">
                            {post.title}
                          </h2>
                          <p className="font-body text-sm text-obys-text-secondary line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-obys-text-muted">
                            <span>{post.readingTime}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const BlogPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Blog</span>
            </AnimatedSection>
            <TextSplitter
              text="Insights & Notícias"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Projectos de sucesso, tendências e conhecimento sobre design, desenvolvimento e marketing digital.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="section-padding bg-obys-dark flex justify-center items-center">
              <p className="body-base text-obys-text-muted">Carregando posts...</p>
            </div>
          }
        >
          <BlogContent />
        </Suspense>
      </div>
    </PageTransition>
  )
}

export default BlogPage
