'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';

const ThoughtClient = ({ thought }) => {
  // Simple reading time estimator
  const getReadingTime = (text) => {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  };

  const readingTime = getReadingTime(thought.content || "");

  return (
    <div className="min-h-screen bg-theme text-primary relative overflow-hidden font-sans pb-20">
      {/* Background radial glow decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* Header Navigation */}
      <div className="border-b border-separator/20 bg-theme/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/thoughts"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-secondary hover:text-primary transition-all duration-300 px-4 py-2 bg-surface-secondary border border-separator/40 hover:border-accent/40 rounded-full shadow-sm"
          >
            <FaArrowLeft className="mr-2 text-[10px]" />
            Back to Thoughts
          </Link>
          <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">
            Reading Article
          </span>
        </div>
      </div>

      {/* Main Article Section */}
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Metadata */}
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                {thought.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-tertiary font-medium">
                <FaClock className="text-zinc-500" />
                {readingTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight tracking-tight">
              {thought.title}
            </h1>
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-secondary pt-2 border-b border-separator/15 pb-6">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500 text-xs shrink-0" />
                <time className="font-semibold">{new Date(thought.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</time>
              </div>
            </div>

            {/* Featured Image */}
            {thought.imageUrl && (
              <div className="relative w-full h-[240px] sm:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-separator/30 mt-6 shrink-0">
                <img
                  src={thought.imageUrl}
                  alt={thought.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Contents */}
          <div className="article-content bg-glass rounded-3xl p-6 sm:p-10 border border-separator/30 shadow-md">
            <div 
              className="leading-relaxed space-y-6 text-sm sm:text-base text-secondary"
            >
              {thought.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Headings check: Roman numerals or CAPS:
                if (paragraph.match(/^[IVX]+\./) || paragraph.match(/^[A-Z\s]{4,}:$/)) {
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-black text-primary pt-6 mt-6 border-t border-separator/10 first:border-none first:pt-0 first:mt-0">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Subheadings check: Title Case + Colon:
                if (paragraph.match(/^[A-Z][a-z\s]+:$/) && paragraph.length < 50) {
                  return (
                    <h3 key={index} className="text-base sm:text-lg font-bold text-accent pt-4">
                      {paragraph}
                    </h3>
                  );
                }
                
                // Check if paragraph is list item (starting with "-" or "*"):
                if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                  const cleaned = paragraph.trim().replace(/^[-*]\s+/, '');
                  return (
                    <div key={index} className="flex items-start pl-2">
                      <span className="text-accent mr-3 mt-1.5 shrink-0 text-[8px]">•</span>
                      <p className="text-secondary">{cleaned}</p>
                    </div>
                  );
                }

                // Regular paragraph
                return (
                  <p key={index} className="text-secondary">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags Footer */}
          {thought.tags && thought.tags.length > 0 && (
            <footer className="pt-8 border-t border-separator/20">
              <h4 className="text-xs font-bold text-tertiary uppercase tracking-wider mb-4">
                Article Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {thought.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-surface-secondary border border-separator/40 hover:border-accent/40 text-secondary text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </motion.article>
      </div>
    </div>
  );
};

export default ThoughtClient;
