import { blogPosts } from './blog-posts'
import { projectBlogPosts } from './project-blog-posts'

// Inclui os artigos editoriais existentes e os estudos de caso publicados.
export const publishedBlogPosts = [...projectBlogPosts, ...blogPosts]
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

export const featuredBlogPost = blogPosts.find(post => post.featured) ?? blogPosts[0]
