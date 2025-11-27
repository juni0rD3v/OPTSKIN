import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { blogPostsData } from '../data/blogPosts';
import { BlogPost } from '../types';

interface BlogPageProps {
  onPostClick: (post: BlogPost) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onPostClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Featured post is always the first one
  const featuredPost = blogPostsData[0];
  
  // The rest of the posts for pagination
  const remainingPosts = blogPostsData.slice(1);
  
  const totalPages = Math.ceil(remainingPosts.length / itemsPerPage);
  
  const currentPosts = remainingPosts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of grid
      const grid = document.getElementById('blog-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-20 animate-fade-in bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-2 block">Optimum Skin Journal</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Latest Stories & Insights</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Expert advice, treatment guides, and the latest news from the world of aesthetic medicine.
          </p>
          
          <div className="relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 md:px-6 container mx-auto">
        <div 
          className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => onPostClick(featuredPost)}
        >
          <div className="h-64 md:h-96 relative overflow-hidden">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded">Featured</span>
              <span className="text-gray-500 flex items-center gap-1"><Calendar size={12} /> {featuredPost.date}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gold-600 transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 mb-6 line-clamp-3">
              {featuredPost.excerpt}
            </p>
            <button className="text-black font-bold border-b-2 border-gold-400 pb-1 hover:text-gold-600 transition-colors flex items-center gap-2">
              Read Full Article <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blog-grid" className="pb-20 px-4 md:px-6 container mx-auto">
        <div className="flex items-center justify-between mb-8 px-2">
           <h3 className="font-serif text-2xl font-bold text-gray-900 border-l-4 border-gold-500 pl-3">Recent Articles</h3>
           <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onPostClick(post)}
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {post.category && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {post.category}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-3">
                  <Calendar size={12} /> {post.date}
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {post.excerpt || "Click to read more about this topic..."}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-gold-600 transition-colors flex items-center gap-1">
                    Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-gray-300 hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-400 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    currentPage === page 
                    ? 'bg-gold-600 text-white shadow-lg scale-110' 
                    : 'bg-white text-gray-600 hover:bg-gold-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-gray-300 hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-400 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;