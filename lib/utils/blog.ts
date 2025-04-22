import { BlogPost, Category, Tag, BlogPagination } from "../types/blog";

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de leitura`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function filterPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts.filter(post => 
    post.categories.some(cat => cat.slug === category)
  );
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => 
    post.tags.some(t => t.slug === tag)
  );
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.categories.some(cat => cat.name.toLowerCase().includes(searchTerm)) ||
    post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm))
  );
}

export function paginatePosts(
  posts: BlogPost[],
  page: number = 1,
  postsPerPage: number = 9
): { posts: BlogPost[]; pagination: BlogPagination } {
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      postsPerPage,
      totalPosts,
    },
  };
}

export function getAllCategories(posts: BlogPost[]): Category[] {
  const categoriesMap = new Map<string, Category>();
  
  posts.forEach(post => {
    post.categories.forEach(category => {
      if (!categoriesMap.has(category.id)) {
        categoriesMap.set(category.id, category);
      }
    });
  });
  
  return Array.from(categoriesMap.values());
}

export function getAllTags(posts: BlogPost[]): Tag[] {
  const tagsMap = new Map<string, Tag>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tagsMap.has(tag.id)) {
        tagsMap.set(tag.id, tag);
      }
    });
  });
  
  return Array.from(tagsMap.values());
}

export function generateRSSFeed(posts: BlogPost[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw';
  
  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <author>${post.author.name}</author>
      ${post.categories.map(cat => `<category>${cat.name}</category>`).join('')}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ABIPTOM Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Últimas notícias e insights sobre design, desenvolvimento web e marketing digital da ABIPTOM</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
} 