import React from 'react';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onBookClick: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack, onBookClick }) => {
  return (
    <div className="pt-24 pb-20 px-4 md:px-6 bg-white min-h-screen animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gold-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Stories
        </button>

        {/* Header Content */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-gold-600 mb-4">
            {post.category && (
              <span className="bg-gold-50 text-gold-800 px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} /> {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-500">
              <Calendar size={12} /> {post.date}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {post.author && (
            <div className="flex items-center justify-center gap-2 text-gray-600 font-medium">
               <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                 <User size={16} />
               </div>
               <span>By {post.author}</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-12 aspect-video">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <article className="prose prose-lg prose-gold mx-auto text-gray-600 leading-relaxed">
           {post.content ? (
             post.content.map((paragraph, idx) => (
               <p key={idx} className="mb-6">{paragraph}</p>
             ))
           ) : (
             <p>{post.excerpt}</p>
           )}
        </article>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12 text-center border border-gold-100">
          <Clock className="text-gold-500 mx-auto mb-4" size={32} />
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Ready to transform your skin?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Book a consultation with our experts today and start your journey to a more radiant you.
          </p>
          <button 
            onClick={onBookClick}
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gold-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book an Appointment
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlogPostDetail;