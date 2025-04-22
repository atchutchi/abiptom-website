export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Author = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  readingTime: string;
  featured?: boolean;
};

export type BlogPagination = {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  totalPosts: number;
}; 