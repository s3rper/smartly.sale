import { useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import { blogPosts, blogCategories } from '../lib/blog-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 10;

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return blogPosts;
    }
    return blogPosts.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of blog list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="py-10">
      {/* Category filter */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[{ slug: 'all', name: 'All Posts' }, ...blogCategories].map(cat => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
                  style={active
                    ? { background: '#f97316', color: '#fff', borderColor: '#f97316' }
                    : { background: 'transparent', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
                  }
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center mb-8">
            Showing {startIndex + 1}–{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            {selectedCategory !== 'all' && (
              <> in <span className="font-semibold" style={{ color: '#f97316' }}>
                {blogCategories.find(c => c.slug === selectedCategory)?.name}
              </span></>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-6">
                No posts in this category yet. Check back soon!
              </p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="px-6 py-3 rounded-full text-white font-bold hover:opacity-90 transition-opacity"
                style={{ background: '#f97316' }}
              >
                View All Posts
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-muted-foreground text-sm">…</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className="min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all border"
                      style={currentPage === page
                        ? { background: '#f97316', color: '#fff', borderColor: '#f97316' }
                        : { background: 'transparent', color: 'var(--foreground)', borderColor: 'var(--border)' }
                      }
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
