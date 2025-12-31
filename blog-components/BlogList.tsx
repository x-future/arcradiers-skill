import React, { useState, useMemo } from 'react';
import { Search, Tag as TagIcon, Filter } from 'lucide-react';
import BlogCard from './BlogCard';
import { BlogPost } from '../blog-utils/frontmatter';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.meta.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.meta.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.meta.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTag = selectedTag === null || post.meta.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter((p) => p.meta.featured);
  const regularPosts = filteredPosts.filter((p) => !p.meta.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          ARC Raiders Skill Tree Blog
        </h1>
        <p className="text-xl text-zinc-400">
          Guides, builds, and tips to master your skill tree
        </p>
      </header>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f0f11] border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-arc-mob transition-colors"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-zinc-500" />
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedTag === null
                  ? 'bg-arc-mob text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-arc-mob text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-zinc-400">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Featured Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <BlogCard
                key={post.meta.slug}
                meta={post.meta}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section>
        {featuredPosts.length > 0 && regularPosts.length > 0 && (
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            All Posts
          </h2>
        )}
        {regularPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <BlogCard
                key={post.meta.slug}
                meta={post.meta}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        ) : (
          filteredPosts.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No posts found matching your criteria.
            </div>
          )
        )}
      </section>
    </div>
  );
}
