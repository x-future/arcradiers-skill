import React from 'react';
import { BlogPostMeta } from '../blog-utils/frontmatter';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  posts: Array<{ meta: BlogPostMeta; readingTime: number }>;
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter((p) => p.meta.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <aside className="bg-[#0f0f11] border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-display font-bold text-white mb-4">Related Posts</h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <BlogCard
            key={post.meta.slug}
            meta={post.meta}
            readingTime={post.readingTime}
          />
        ))}
      </div>
    </aside>
  );
}
