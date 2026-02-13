export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  readTime: number;
  relatedProducts: string[]; // Product IDs
  keywords: string[];
  views?: number;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}
