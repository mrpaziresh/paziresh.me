import postsData from '../data/posts.json';
import { Post } from '../data/types';

export type Article = Post;

export const ARTICLES: Article[] = (postsData as Article[])
  .filter((post) => post.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getExcerpt(markdown: string, length = 140): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return "Coming soon — this one's still being written.";
  return text.length > length ? text.slice(0, length).trim() + '…' : text;
}

export function estimateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return words ? Math.max(1, Math.round(words / 200)) : 0;
}
