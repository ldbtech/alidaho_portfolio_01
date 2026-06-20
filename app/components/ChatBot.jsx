'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaRedo, FaChevronDown, FaComments, FaBriefcase } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Ali's AI career assistant. Ask me anything about his skills, projects, or background — or paste a job description and I'll analyze how well Ali fits the role. 📋",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [jobFitMode, setJobFitMode] = useState(false);
  const [jobText, setJobText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestionChips = [
    { label: "🛠️ Skills", query: "What are Ali's core technical skills?" },
    { label: "📱 Flikor App", query: "Tell me about the Flikor roommates app" },
    { label: "⚽ Fun Fact", query: "Tell me a fun fact about Ali" },
    { label: "✉️ Contact", query: "How can I contact Ali?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      // Auto focus on input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.isFallback) {
        setIsFallback(true);
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.text,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I ran into an error connecting to the backend. Please try again later!",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobFit = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: `📋 **Job fit check requested**\n\n${text}`,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setJobText('');
    setJobFitMode(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'jobfit', jobDescription: text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.isFallback) {
        setIsFallback(true);
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.text,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error analyzing job fit:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I couldn't analyze that job description right now. Please try again later!",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(inputMessage);
  };

  const handleReset = () => {
    if (window.confirm("Reset conversation history?")) {
      setMessages([
        {
          id: Date.now(),
          text: "Hi! I'm Ali's AI career assistant. Ask me anything about his skills, projects, or background — or paste a job description and I'll analyze how well Ali fits the role. 📋",
          sender: 'bot'
        }
      ]);
      setIsFallback(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-blue-400/20"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
          >
            <FaComments className="text-xl animate-pulse" />
            <span className="font-semibold text-sm tracking-wide hidden sm:inline">Ask Ali AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] sm:w-96 h-[560px] max-h-[85vh] bg-surface-secondary/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col border border-separator/40 dark:border-zinc-800/80 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-surface dark:bg-zinc-900/60 border-b border-separator/30 dark:border-zinc-800/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <FaRobot className="text-blue-500 text-base" />
                </div>
                <div>
                  <h3 className="text-primary font-bold text-sm leading-none">Ali's Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Active Agent</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                >
                  <FaRedo className="text-xs" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Minimize chat"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                >
                  <FaChevronDown className="text-sm" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Fallback Banner for Owner */}
            {isFallback && (
              <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-[11px] text-yellow-500/90 leading-tight">
                💡 Currently running in mock mode. Add your <code>GEMINI_API_KEY</code> on Vercel to activate live Gemini responses.
              </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
                        : 'bg-surface dark:bg-zinc-900/80 text-secondary rounded-bl-none border border-separator/35 dark:border-zinc-800/40 shadow-sm'
                    }`}
                  >
                    {/* Render basic markdown links */}
                    {message.text.split('\n').map((paragraph, index) => {
                      // Check for markdown links: [text](url)
                      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                      let lastIndex = 0;
                      let parts = [];
                      let match;

                      while ((match = linkRegex.exec(paragraph)) !== null) {
                        if (match.index > lastIndex) {
                          parts.push(paragraph.substring(lastIndex, match.index));
                        }
                        parts.push(
                          <a
                            key={match.index}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 dark:text-blue-400 hover:underline font-semibold"
                          >
                            {match[1]}
                          </a>
                        );
                        lastIndex = linkRegex.lastIndex;
                      }

                      if (lastIndex < paragraph.length) {
                        parts.push(paragraph.substring(lastIndex));
                      }

                      return (
                        <p key={index} className={index > 0 ? "mt-1.5" : ""}>
                          {parts.length > 0 ? parts : paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface dark:bg-zinc-900/80 rounded-2xl rounded-bl-none px-4 py-3 text-sm border border-separator/35 dark:border-zinc-800/40 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.query)}
                      className="px-3 py-1.5 bg-surface dark:bg-zinc-900/50 border border-separator/50 dark:border-zinc-800 hover:border-accent/40 dark:hover:border-blue-500/40 hover:bg-surface-tertiary dark:hover:bg-zinc-800 text-secondary rounded-full text-xs font-medium transition-all duration-300 shadow-sm"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setJobFitMode(true)}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 hover:border-blue-500/60 text-blue-500 dark:text-blue-400 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaBriefcase className="text-xs" /> Hiring? Paste a job description to check Ali's fit
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-separator/30 dark:border-zinc-800/50 bg-surface/20 dark:bg-zinc-950/20">
              {jobFitMode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaBriefcase className="text-xs" /> Job Fit Check
                    </span>
                    <button
                      type="button"
                      onClick={() => { setJobFitMode(false); setJobText(''); }}
                      className="text-zinc-400 hover:text-zinc-200 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    placeholder="Paste the full job description here…"
                    rows={4}
                    disabled={isLoading}
                    autoFocus
                    className="w-full bg-surface-secondary dark:bg-zinc-900/80 text-primary rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 border border-separator/45 dark:border-zinc-800/80 placeholder-zinc-500 disabled:opacity-50 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleJobFit(jobText)}
                    disabled={!jobText.trim() || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15"
                  >
                    <FaBriefcase className="text-xs" /> Analyze my fit
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => setJobFitMode(true)}
                    title="Check fit against a job description"
                    className="shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-surface-secondary dark:bg-zinc-900/80 border border-separator/45 dark:border-zinc-800/80 text-blue-500 hover:bg-blue-500/10 transition-colors"
                  >
                    <FaBriefcase className="text-sm" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1 min-w-0 bg-surface-secondary dark:bg-zinc-900/80 text-primary rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent border border-separator/45 dark:border-zinc-800/80 placeholder-zinc-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:hover:bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/15"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Bar */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-5 py-3.5 bg-surface dark:bg-zinc-900 border border-separator dark:border-zinc-800 rounded-full shadow-2xl text-primary dark:text-zinc-200"
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-xs tracking-wider uppercase">Open Chat</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;