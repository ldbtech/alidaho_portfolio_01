'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaImage, FaExternalLinkAlt } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { database, saveThought, deleteThought } from '../../services/firebase';
import Link from 'next/link';

const ThoughtManager = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingThought, setEditingThought] = useState(null);
  const [isAddingThought, setIsAddingThought] = useState(false);

  useEffect(() => {
    console.log('Initializing ThoughtManager...');
    if (!database) {
      console.error('Firebase database is not initialized');
      setError('Database connection error');
      setLoading(false);
      return;
    }

    const thoughtsRef = ref(database, 'thoughts');
    console.log('Setting up Firebase listener for thoughts...');

    const unsubscribe = onValue(thoughtsRef, (snapshot) => {
      console.log('Received data from Firebase:', snapshot.val());
      try {
        const data = snapshot.val();
        if (data) {
          const thoughtsArray = Object.entries(data).map(([id, thought]) => ({
            id,
            ...thought
          }));
          console.log('Processed thoughts array:', thoughtsArray);
          setThoughts(thoughtsArray);
        } else {
          console.log('No thoughts found in database');
          setThoughts([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error processing thoughts:', err);
        setError('Failed to load thoughts: ' + err.message);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setError('Failed to load thoughts: ' + error.message);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  const handleSaveThought = async (thoughtData) => {
    try {
      const thoughtId = editingThought ? editingThought.id : Date.now().toString();
      const thought = {
        ...thoughtData,
        id: thoughtId,
        createdAt: editingThought ? editingThought.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveThought(thought);
      setEditingThought(null);
      setIsAddingThought(false);
      setError(null);
    } catch (err) {
      console.error('Error saving thought:', err);
      setError('Failed to save thought: ' + err.message);
    }
  };

  const handleDeleteThought = async (thoughtId) => {
    try {
      await deleteThought(thoughtId);
      setError(null);
    } catch (err) {
      console.error('Error deleting thought:', err);
      setError('Failed to delete thought: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Thoughts</h2>
        <button
          onClick={() => setIsAddingThought(true)}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaPlus /> Add New Thought
        </button>
      </div>

      {(isAddingThought || editingThought) && (
        <ThoughtForm
          thought={editingThought || {}}
          onSave={handleSaveThought}
          onCancel={() => {
            setEditingThought(null);
            setIsAddingThought(false);
          }}
        />
      )}

      <div className="grid gap-6">
        {thoughts.map((thought) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            onEdit={setEditingThought}
            onDelete={handleDeleteThought}
          />
        ))}
      </div>
    </div>
  );
};

const ThoughtForm = ({ thought, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: thought.title || '',
    content: thought.content || '',
    category: thought.category || 'AI',
    imageUrl: thought.imageUrl || '',
    tags: thought.tags || [],
    summary: thought.summary || '',
    targetMode: thought.targetMode || 'both',
    date: thought.date ? new Date(thought.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatText = (format) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'heading1':
        newText = `# ${selectedText}`;
        break;
      case 'heading2':
        newText = `## ${selectedText}`;
        break;
      case 'heading3':
        newText = `### ${selectedText}`;
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      default:
        newText = selectedText;
    }

    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData({ ...formData, content: newContent });
  };

  const insertText = (text) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = formData.content.substring(0, start) + text + formData.content.substring(end);
    setFormData({ ...formData, content: newContent });
  };

  const renderPreview = () => {
    return formData.content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return <br key={index} />;
      
      // Bold text
      if (paragraph.includes('**')) {
        paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }
      
      // Italic text
      if (paragraph.includes('*')) {
        paragraph = paragraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
      }
      
      // Headings
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-blue-400 mt-6 mb-3" dangerouslySetInnerHTML={{ __html: paragraph.substring(4) }} />;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: paragraph.substring(3) }} />;
      }
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: paragraph.substring(2) }} />;
      }
      
      // Lists
      if (paragraph.startsWith('- ')) {
        return <li key={index} className="ml-4 text-gray-300" dangerouslySetInnerHTML={{ __html: paragraph.substring(2) }} />;
      }
      
      // Quotes
      if (paragraph.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4" dangerouslySetInnerHTML={{ __html: paragraph.substring(2) }} />;
      }
      
      // Code
      if (paragraph.includes('`')) {
        paragraph = paragraph.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-blue-400">$1</code>');
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: paragraph }} />;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181818] p-8 rounded-xl border border-gray-800 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">
          {thought.id ? 'Edit Thought' : 'Create New Thought'}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Article Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-lg"
            placeholder="Enter a compelling title for your article"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Article Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows="3"
            placeholder="Write a brief summary that will appear on the thoughts list"
            required
          />
        </div>

        {/* Content with Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Article Content</label>
          
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-[#2A2A2A] rounded-lg border border-gray-700">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold transition-colors"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm italic transition-colors"
              title="Italic"
            >
              I
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button
              type="button"
              onClick={() => formatText('heading1')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => formatText('heading2')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => formatText('heading3')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Heading 3"
            >
              H3
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button
              type="button"
              onClick={() => formatText('list')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => formatText('quote')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Quote"
            >
              " Quote
            </button>
            <button
              type="button"
              onClick={() => formatText('code')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Code"
            >
              { } Code
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button
              type="button"
              onClick={() => insertText('\n\n---\n\n')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Horizontal Line"
            >
              ―――
            </button>
          </div>

          {showPreview ? (
            <div className="min-h-[400px] p-6 bg-[#121212] rounded-lg border border-gray-700">
              <div className="prose prose-invert max-w-none">
                {renderPreview()}
              </div>
            </div>
          ) : (
            <textarea
              id="content-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none font-mono text-sm"
              rows="15"
              placeholder="Write your article content here. Use the formatting toolbar above to add styling..."
              required
            />
          )}
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="AI">AI</option>
              <option value="Software Development">Software Development</option>
              <option value="Technology">Technology</option>
              <option value="Career">Career</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Show in Mode (Visibility)</label>
            <select
              value={formData.targetMode || 'both'}
              onChange={(e) => setFormData({ ...formData, targetMode: e.target.value })}
              className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="both">Both (Career & Freelance)</option>
              <option value="job">Career Mode Only</option>
              <option value="freelance">Freelance Mode Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Publish Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              className="w-full px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="AI, Machine Learning, Web Development"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="flex-1 px-4 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            />
            <button
              type="button"
              className="px-6 py-3 bg-[#2A2A2A] rounded-lg border border-gray-700 hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
            >
              <FaImage /> Upload
            </button>
          </div>
          {formData.imageUrl && (
            <div className="mt-4">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-700"
                onError={() => setFormData({ ...formData, imageUrl: '' })}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            {thought.id ? 'Update Thought' : 'Publish Thought'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const ThoughtCard = ({ thought, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181818] p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            href={`/thoughts/${thought.id}`}
            target="_blank"
            className="block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {thought.title}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
              {thought.category}
            </span>
            <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
              {new Date(thought.date).toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
              thought.targetMode === 'freelance' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              thought.targetMode === 'job' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-gray-500/20 text-gray-400 border border-separator/35'
            }`}>
              Mode: {thought.targetMode || 'both'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/thoughts/${thought.id}`}
            target="_blank"
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View public page"
          >
            <FaExternalLinkAlt />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(thought);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(thought.id);
            }}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <Link
        href={`/thoughts/${thought.id}`}
        target="_blank"
        className="block"
      >
        {thought.imageUrl && (
          <img
            src={thought.imageUrl}
            alt={thought.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-gray-300 mb-4">{thought.summary}</p>

        <div className="flex flex-wrap gap-2">
          {thought.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#2A2A2A] rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

export default ThoughtManager; 