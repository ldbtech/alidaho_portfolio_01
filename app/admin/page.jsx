"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaTrash, FaPlus, FaEdit, FaLink, FaSignOutAlt, FaProjectDiagram, FaUser, FaInfoCircle, FaLightbulb, FaFilePdf, FaEye, FaArrowLeft } from "react-icons/fa";
import { getDatabase, ref, set, remove, get } from "firebase/database";
import database from "../services/firebase";
import { fetchData, saveProject, saveAbout, getCurrentUser, logout, initAuthStateListener, getVisitorCount, getProjectCount } from "../services/firebase";
import LoginForm from "../components/LoginForm";
import ProjectManager from '../components/admin/ProjectManager';
import AboutManager from '../components/admin/AboutManager';
import ProfileManager from '../components/admin/ProfileManager';
import ThoughtManager from '../components/admin/ThoughtManager';
import ResumeManager from '../components/admin/ResumeManager';
import Link from 'next/link';
import LoadingState from '../components/LoadingState';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAbout, setEditingAbout] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Statistics state
  const [visitsStat, setVisitsStat] = useState(0);
  const [projectsStat, setProjectsStat] = useState(0);
  const [thoughtsStat, setThoughtsStat] = useState(0);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = initAuthStateListener((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load metrics & data concurrently
      const [projectsData, aboutData, visitsCount, projectCount] = await Promise.all([
        fetchData('projects'),
        fetchData('about'),
        getVisitorCount(),
        getProjectCount()
      ]);

      if (projectsData) {
        setProjects(Object.values(projectsData));
      }
      setAbout(aboutData);
      setVisitsStat(visitsCount || 0);
      setProjectsStat(projectCount || 0);

      // Fetch thoughts count
      if (database) {
        const thoughtsRef = ref(database, 'thoughts');
        const thoughtsSnapshot = await get(thoughtsRef);
        const thoughtsVal = thoughtsSnapshot.val();
        setThoughtsStat(thoughtsVal ? Object.keys(thoughtsVal).length : 0);
      }

    } catch (error) {
      console.error("Error loading data:", error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSave = async (project) => {
    if (!isAuthenticated) {
      showError("You must be logged in to save changes");
      return;
    }

    try {
      setError(null);
      await saveProject(project);
      await loadData();
      setEditingProject(null);
      showSuccess("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      if (error.message.includes("PERMISSION_DENIED")) {
        showError("Authentication failed. Please check your Firebase configuration and database rules.");
      } else {
        showError(error.message);
      }
    }
  };

  const handleAboutSave = async (data) => {
    if (!isAuthenticated) {
      showError("You must be logged in to save changes");
      return;
    }

    try {
      setError(null);
      await saveAbout(data);
      await loadData();
      setEditingAbout(null);
      showSuccess("About section updated successfully!");
    } catch (error) {
      console.error("Error saving about:", error);
      if (error.message.includes("PERMISSION_DENIED")) {
        showError("Authentication failed. Please check your Firebase configuration and database rules.");
      } else {
        showError(error.message);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!isAuthenticated) {
      showError("You must be logged in to delete projects");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const projectRef = ref(database, `projects/${projectId}`);
        await remove(projectRef);
        await loadData();
        showSuccess("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
        showError(error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <LoadingState message="Authorizing & loading admin dashboard..." />
      </div>
    );
  }

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'thoughts', label: 'My Thoughts', icon: FaLightbulb },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'resume', label: 'Resume', icon: FaFilePdf },
    { id: 'about', label: 'About', icon: FaInfoCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectManager />;
      case 'thoughts':
        return <ThoughtManager />;
      case 'profile':
        return <ProfileManager />;
      case 'resume':
        return <ResumeManager />;
      case 'about':
        return <AboutManager />;
      default:
        return <ProjectManager />;
    }
  };

  return (
    <div className="min-h-screen bg-theme text-primary p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-2xl">
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500 rounded-2xl">
            <p className="text-green-500 text-sm font-medium">{success}</p>
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-separator/20 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Admin</span>
            </h1>
            <p className="text-secondary text-xs sm:text-sm mt-1">Manage content, upload resumes, and review statistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 bg-surface-secondary border border-separator/40 hover:border-accent/40 rounded-full flex items-center gap-2 text-sm text-secondary hover:text-primary transition-all duration-300"
            >
              <FaArrowLeft className="text-xs" /> View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center gap-2 text-sm transition-all duration-300 font-semibold"
            >
              <FaSignOutAlt className="text-xs" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-glass rounded-2xl p-5 border border-separator/35 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-xl">
              <FaEye />
            </div>
            <div>
              <span className="block text-2xl font-black text-primary">{visitsStat}</span>
              <span className="text-xs text-secondary font-semibold">Total Profile Visits</span>
            </div>
          </div>
          <div className="bg-glass rounded-2xl p-5 border border-separator/35 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-xl">
              <FaProjectDiagram />
            </div>
            <div>
              <span className="block text-2xl font-black text-primary">{projectsStat}</span>
              <span className="text-xs text-secondary font-semibold">Published Projects</span>
            </div>
          </div>
          <div className="bg-glass rounded-2xl p-5 border border-separator/35 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xl">
              <FaLightbulb />
            </div>
            <div>
              <span className="block text-2xl font-black text-primary">{thoughtsStat}</span>
              <span className="text-xs text-secondary font-semibold">Blog Thoughts</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 border-b border-separator/20 pb-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 ${
                  isSelected
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-surface-secondary hover:bg-surface-tertiary text-secondary hover:text-primary border border-separator/40'
                }`}
              >
                <Icon className="text-sm shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Manager Contents */}
        <div className="bg-glass rounded-3xl p-6 sm:p-8 border border-separator/30 shadow-md">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState(project);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Title is required");
      }
      if (!formData.description) {
        throw new Error("Description is required");
      }
      if (!formData.imgUrl) {
        throw new Error("Image URL is required");
      }

      // Validate image URL
      try {
        new URL(formData.imgUrl);
      } catch {
        throw new Error("Please enter a valid image URL");
      }

      await onSave(formData);
    } catch (error) {
      console.error("Error in form submission:", error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#181818] p-6 rounded-2xl space-y-4">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2">
          <label className="block text-sm text-[#ADB7BE]">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL here"
              value={formData.imgUrl || ""}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
              className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-all duration-300 flex items-center gap-2"
            >
              <FaLink /> Get URL
            </a>
          </div>
          {formData.imgUrl && (
            <div className="mt-2">
              <img
                src={formData.imgUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={() => setError("Invalid image URL")}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="GitHub URL"
          value={formData.gitUrl || ""}
          onChange={(e) => setFormData({ ...formData, gitUrl: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Preview URL"
          value={formData.previewUrl || ""}
          onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        placeholder="Description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaSave /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-[#181818] p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-[#ADB7BE] mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#2A2A2A] text-[#ADB7BE] rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 rounded-full flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

const AboutForm = ({ about, onSave, onCancel }) => {
  const [formData, setFormData] = useState(about);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#181818] p-6 rounded-2xl space-y-4">
      <textarea
        placeholder="Bio"
        value={formData.bio || ""}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaSave /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminPage; 