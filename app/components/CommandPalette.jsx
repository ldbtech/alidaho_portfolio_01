'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaProjectDiagram, FaCompass, FaPalette, FaFileAlt, FaRobot } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { fetchData } from '../services/firebase';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const { toggleTheme, isDark } = useTheme();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load projects to search them
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchData('projects');
        if (data) {
          setProjects(Object.values(data));
        }
      } catch (err) {
        console.error('Failed to load projects for command palette:', err);
      }
    };
    loadProjects();
  }, []);

  // Listen to Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleNavigation = (id) => {
    onClose();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: router redirect if on another page
      window.location.href = `/#${id}`;
    }
  };

  const actions = [
    {
      id: 'nav-home',
      title: 'Go to Hero Section',
      category: 'Navigation',
      icon: FaCompass,
      action: () => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'nav-about',
      title: 'Go to About Me',
      category: 'Navigation',
      icon: FaCompass,
      action: () => handleNavigation('about')
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      category: 'Navigation',
      icon: FaCompass,
      action: () => handleNavigation('projects')
    },
    {
      id: 'nav-contact',
      title: 'Go to Contact',
      category: 'Navigation',
      icon: FaCompass,
      action: () => handleNavigation('contact')
    },
    {
      id: 'nav-thoughts',
      title: 'Go to My Thoughts',
      category: 'Navigation',
      icon: FaCompass,
      action: () => { onClose(); window.location.href = '/thoughts'; }
    },
    {
      id: 'toggle-theme',
      title: `Toggle Theme (Current: ${isDark ? 'Dark' : 'Light'})`,
      category: 'Preferences',
      icon: FaPalette,
      action: () => { toggleTheme(); onClose(); }
    },
    {
      id: 'trigger-ai',
      title: 'Ask Ali AI Assistant a question',
      category: 'Actions',
      icon: FaRobot,
      action: () => {
        onClose();
        // Custom event to open AI ChatBot
        const chatBtn = document.querySelector('button[class*="Ask Ali AI"]');
        if (chatBtn) {
          chatBtn.click();
        } else {
          // If ChatBot is already open or simple fallback
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
    }
  ];

  // Filter actions and projects based on query
  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(query.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(query.toLowerCase())) ||
    (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0c0c0e] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800/80 overflow-hidden max-h-[70vh] flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 border-b border-zinc-200/80 dark:border-zinc-800/85">
              <FaSearch className="text-zinc-400 dark:text-zinc-500 text-base shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search projects..."
                className="w-full bg-transparent py-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="px-2 py-1 text-[10px] border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[50vh] scrollbar-thin">
              {/* Commands Category */}
              {filteredActions.length > 0 && (
                <div>
                  <h4 className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Commands
                  </h4>
                  <div className="space-y-0.5 mt-1">
                    {filteredActions.map(action => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/60 flex items-center gap-3 transition-colors group"
                        >
                          <Icon className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors text-sm shrink-0" />
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium text-xs sm:text-sm">
                            {action.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects Category */}
              {filteredProjects.length > 0 && (
                <div>
                  <h4 className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Projects ({filteredProjects.length})
                  </h4>
                  <div className="space-y-0.5 mt-1">
                    {filteredProjects.map(project => (
                      <button
                        key={project.id || project.title}
                        onClick={() => {
                          onClose();
                          // Navigate to project section
                          handleNavigation('projects');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/60 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FaProjectDiagram className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors text-sm shrink-0" />
                          <div>
                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm block">
                              {project.title}
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-500 text-[11px] line-clamp-1">
                              {project.description}
                            </span>
                          </div>
                        </div>
                        {project.tags && project.tags.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md font-medium uppercase shrink-0">
                            {project.tags[0]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredActions.length === 0 && filteredProjects.length === 0 && (
                <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
                  No commands or projects match your query.
                </div>
              )}
            </div>

            {/* Footer Help */}
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/85 text-[10px] text-zinc-400 dark:text-zinc-500 flex justify-between items-center">
              <div>
                Use <span className="font-semibold text-zinc-500 dark:text-zinc-400">↑↓</span> to navigate, <span className="font-semibold text-zinc-500 dark:text-zinc-400">Enter</span> to select
              </div>
              <div>
                Press <span className="font-semibold text-zinc-500 dark:text-zinc-400">⌘K</span> to toggle
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
