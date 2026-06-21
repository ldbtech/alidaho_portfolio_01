'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../services/firebase';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaArrowLeft, FaClock } from 'react-icons/fa';
import { usePortfolioMode } from '../contexts/PortfolioModeContext';

const ThoughtsPage = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        console.log('Starting to fetch thoughts...');
        if (!database) {
          throw new Error('Firebase database is not initialized');
        }

        const thoughtsRef = ref(database, 'thoughts');
        
        // Initial fetch
        const snapshot = await get(thoughtsRef);
        console.log('Initial data fetch:', snapshot.val());

        // Real-time listener
        const unsubscribe = onValue(thoughtsRef, (snapshot) => {
          try {
            const data = snapshot.val();
            if (!data) {
              setThoughts([]);
              return;
            }

            const thoughtsArray = Object.entries(data)
              .map(([id, thought]) => {
                if (!thought.title || !thought.content || !thought.date) {
                  return null;
                }
                return {
                  id,
                  ...thought,
                  date: thought.date || new Date().toISOString().split('T')[0]
                };
              })
              .filter(Boolean)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            setThoughts(thoughtsArray);
          } catch (err) {
            console.error('Error processing thoughts:', err);
            setError('Failed to process thoughts: ' + err.message);
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Firebase listener error:', error);
          setError('Failed to load thoughts: ' + error.message);
          setLoading(false);
        });

        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error('Error in fetchThoughts:', err);
        setError('Failed to fetch thoughts: ' + err.message);
        setLoading(false);
      }
    };

    fetchThoughts();
  }, []);

  const categories = ['all', 'AI', 'Software Development', 'Technology', 'Career'];

  const { portfolioMode } = usePortfolioMode();

  const modeFilteredThoughts = thoughts.filter((thought) => {
    if (portfolioMode === 'freelance') {
      return !thought.targetMode || thought.targetMode === 'both' || thought.targetMode === 'freelance';
    } else {
      return !thought.targetMode || thought.targetMode === 'both' || thought.targetMode === 'job';
    }
  });

  const filteredThoughts = selectedCategory === 'all'
    ? modeFilteredThoughts
    : modeFilteredThoughts.filter(thought => thought.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme text-primary">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-2xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme text-primary relative overflow-hidden font-sans">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center space-y-6">
        <div className="flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-semibold text-secondary hover:text-primary transition-all duration-300 px-5 py-2.5 rounded-full bg-surface-secondary border border-separator/40 hover:border-accent/40 shadow-sm"
          >
            <FaArrowLeft className="mr-2 text-xs" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Thoughts</span>
        </h1>
        <p className="text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Exploring ideas, sharing tech insights, and documenting my path in AI and software engineering.
        </p>

        <div className="flex justify-center items-center gap-4 text-xs font-semibold uppercase tracking-wider text-tertiary">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {thoughts.length} Articles
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            {categories.length - 1} Categories
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Category Pills */}
        <div className="flex justify-center gap-2 mb-12 overflow-x-auto pb-3 scrollbar-thin">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm font-bold whitespace-nowrap border ${
                selectedCategory === category
                  ? 'bg-accent text-white border-accent shadow-lg shadow-accent/15 scale-105'
                  : 'bg-surface-secondary text-secondary hover:bg-surface-tertiary border-separator/40 hover:border-accent/40'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>

        {/* Thoughts Cards Grid */}
        {filteredThoughts.length === 0 ? (
          <div className="text-center py-20 bg-glass rounded-3xl border border-separator/30 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">
              <FaTag className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No articles found</h3>
            <p className="text-secondary text-xs sm:text-sm max-w-xs mx-auto">
              {selectedCategory === 'all' 
                ? "Start adding thoughts from the admin page to see them list here!"
                : `No articles in the "${selectedCategory}" category yet.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredThoughts.map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`/thoughts/${thought.id}`} className="group block h-full">
                  <article className="bg-glass rounded-3xl overflow-hidden border border-separator/30 hover:border-accent/40 hover:shadow-2xl transition-all duration-500 flex flex-col h-full group-hover:scale-[1.01] glow-border">
                    {/* Featured Image */}
                    {thought.imageUrl && (
                      <div className="relative w-full h-48 sm:h-52 overflow-hidden shrink-0 border-b border-separator/20">
                        <img
                          src={thought.imageUrl}
                          alt={thought.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                    )}
                    
                    {/* Content details */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-tertiary">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-blue-500" />
                            {new Date(thought.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold uppercase tracking-wide">
                            {thought.category}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold group-hover:text-accent transition-colors leading-snug line-clamp-2 text-primary">
                          {thought.title}
                        </h2>

                        <p className="text-secondary text-sm leading-relaxed line-clamp-3">
                          {thought.summary || thought.content?.substring(0, 150) + '...'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-separator/10 flex items-center justify-between text-xs font-bold text-accent group-hover:text-blue-500 transition-colors">
                        <span>Read Article</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtsPage;