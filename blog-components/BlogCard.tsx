import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { BlogPostMeta } from '../blog-utils/frontmatter';

interface BlogCardProps {
  meta: BlogPostMeta;
  readingTime: number;
  excerpt?: string;
}

export default function BlogCard({ meta, readingTime, excerpt }: BlogCardProps) {
  return (
    <article
      className={`bg-[#0f0f11] border rounded-lg overflow-hidden transition-all duration-300 hover:border-arc-mob hover:shadow-lg hover:shadow-arc-mob/10 ${
        meta.featured ? 'border-arc-mob ring-2 ring-arc-mob/50' : 'border-zinc-800'
      }`}
    >
      <a href={`/blog/${meta.slug}.html`} className="block p-6">
        <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <time dateTime={meta.date}>{format(new Date(meta.date), 'MMM dd, yyyy')}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{readingTime} min read</span>
          </div>
          {meta.category && (
            <span className="text-arc-mob font-semibold capitalize">{meta.category}</span>
          )}
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-2 hover:text-arc-mob transition-colors">
          {meta.title}
        </h3>

        {meta.description && (
          <p className="text-zinc-400 mb-4 line-clamp-2">{meta.description}</p>
        )}

        {meta.tags && meta.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} className="text-zinc-500" />
            {meta.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-zinc-800 text-arc-mob px-2.5 py-1 rounded-md hover:bg-zinc-700 transition-colors"
              >
                {tag}
              </span>
            ))}
            {meta.tags.length > 4 && (
              <span className="text-xs text-zinc-500">+{meta.tags.length - 4} more</span>
            )}
          </div>
        )}
      </a>
    </article>
  );
}
