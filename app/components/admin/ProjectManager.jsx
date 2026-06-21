'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchData, saveProject } from '../../services/firebase';
import { ref, remove } from 'firebase/database';
import database from '../../services/firebase';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchData('projects');
            if (data) {
                setProjects(
                    Object.values(data).sort(
                        (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
                    )
                );
            }
        } catch (err) {
            setError('Failed to load projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.target);
        const projectData = {
            id: editingProject?.id || Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            imgUrl: formData.get('imgUrl'),
            gitUrl: formData.get('gitUrl'),
            previewUrl: formData.get('previewUrl'),
            targetMode: formData.get('targetMode') || 'both',
            tags: formData.get('tags')?.split(',').map(tag => tag.trim()) || []
        };

        try {
            await saveProject(projectData);
            await loadProjects();
            setEditingProject(null);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            e.target.reset();
        } catch (err) {
            setError('Failed to save project');
            console.error(err);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const projectRef = ref(database, `projects/${projectId}`);
                await remove(projectRef);
                await loadProjects();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError('Failed to delete project');
                console.error(err);
            }
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#181818] p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-white">Project Management</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                    <p className="text-green-500">Project {editingProject ? 'updated' : 'added'} successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={editingProject?.title}
                            required
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imgUrl"
                            defaultValue={editingProject?.imgUrl}
                            required
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        defaultValue={editingProject?.description}
                        required
                        rows="4"
                        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            name="gitUrl"
                            defaultValue={editingProject?.gitUrl}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Preview URL
                        </label>
                        <input
                            type="url"
                            name="previewUrl"
                            defaultValue={editingProject?.previewUrl}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            defaultValue={editingProject?.tags?.join(', ')}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Show in Mode (Visibility)
                        </label>
                        <select
                            name="targetMode"
                            defaultValue={editingProject?.targetMode || 'both'}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="both">Both (Career & Freelance)</option>
                            <option value="job">Career Mode Only</option>
                            <option value="freelance">Freelance Mode Only</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        {editingProject ? <FaEdit /> : <FaPlus />}
                        {editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                    {editingProject && (
                        <button
                            type="button"
                            onClick={() => setEditingProject(null)}
                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-[#2A2A2A] p-4 rounded-lg">
                        <img
                            src={project.imgUrl}
                            alt={project.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-[#3A3A3A] text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="mb-4">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold uppercase ${
                                project.targetMode === 'freelance' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                project.targetMode === 'job' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-separator/35'
                            }`}>
                                Mode: {project.targetMode || 'both'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingProject(project)}
                                className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProjectManager; 