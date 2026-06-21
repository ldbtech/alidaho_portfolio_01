'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTrash, FaEdit, FaRocket, FaBrain, FaCode, FaDatabase, FaMobileAlt, FaServer, FaCogs, FaListOl } from 'react-icons/fa';
import { fetchFreelanceConfig, saveFreelanceConfig } from '../../services/firebase';

const iconMap = {
  rocket: FaRocket,
  brain: FaBrain,
  code: FaCode,
  database: FaDatabase,
  mobile: FaMobileAlt,
  server: FaServer
};

const FreelanceManager = () => {
  const [config, setConfig] = useState({
    bio: '',
    hourlyRate: '',
    projectStartingPrice: '',
    status: 'Accepting Freelance Projects',
    services: [],
    process: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Services state
  const [editingService, setEditingService] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);

  // Process steps state
  const [editingProcessStep, setEditingProcessStep] = useState(null);
  const [isAddingProcessStep, setIsAddingProcessStep] = useState(false);

  useEffect(() => {
    loadFreelanceData();
  }, []);

  const loadFreelanceData = async () => {
    try {
      setLoading(true);
      const data = await fetchFreelanceConfig();
      if (data) {
        setConfig({
          bio: data.bio || '',
          hourlyRate: data.hourlyRate || '',
          projectStartingPrice: data.projectStartingPrice || '',
          status: data.status || 'Accepting Freelance Projects',
          services: data.services || [],
          process: data.process || []
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load freelance settings');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);
    const updatedConfig = {
      ...config,
      bio: formData.get('bio'),
      hourlyRate: formData.get('hourlyRate'),
      projectStartingPrice: formData.get('projectStartingPrice'),
      status: formData.get('status')
    };

    try {
      await saveFreelanceConfig(updatedConfig);
      setConfig(updatedConfig);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save freelance profile settings');
    }
  };

  // Services handlers
  const handleSaveService = async (serviceData) => {
    setError(null);
    setSuccess(false);

    const newServices = [...config.services];
    if (editingService) {
      const idx = newServices.findIndex(s => s.id === editingService.id);
      if (idx !== -1) {
        newServices[idx] = { ...serviceData, id: editingService.id };
      }
    } else {
      newServices.push({ ...serviceData, id: Date.now().toString() });
    }

    const updatedConfig = {
      ...config,
      services: newServices
    };

    try {
      await saveFreelanceConfig(updatedConfig);
      setConfig(updatedConfig);
      setEditingService(null);
      setIsAddingService(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save service package');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service package?')) {
      const updatedConfig = {
        ...config,
        services: config.services.filter(s => s.id !== serviceId)
      };

      try {
        await saveFreelanceConfig(updatedConfig);
        setConfig(updatedConfig);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error(err);
        setError('Failed to delete service package');
      }
    }
  };

  // Process steps handlers
  const handleSaveProcessStep = async (stepData) => {
    setError(null);
    setSuccess(false);

    const newProcess = [...(config.process || [])];
    if (editingProcessStep) {
      const idx = newProcess.findIndex(p => p.id === editingProcessStep.id);
      if (idx !== -1) {
        newProcess[idx] = { ...stepData, id: editingProcessStep.id };
      }
    } else {
      newProcess.push({ ...stepData, id: Date.now().toString() });
    }

    // Sort by step number
    newProcess.sort((a, b) => (Number(a.stepNumber) || 0) - (Number(b.stepNumber) || 0));

    const updatedConfig = {
      ...config,
      process: newProcess
    };

    try {
      await saveFreelanceConfig(updatedConfig);
      setConfig(updatedConfig);
      setEditingProcessStep(null);
      setIsAddingProcessStep(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save process step');
    }
  };

  const handleDeleteProcessStep = async (stepId) => {
    if (window.confirm('Are you sure you want to delete this process step?')) {
      const updatedConfig = {
        ...config,
        process: (config.process || []).filter(p => p.id !== stepId)
      };

      try {
        await saveFreelanceConfig(updatedConfig);
        setConfig(updatedConfig);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error(err);
        setError('Failed to delete process step');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-2xl text-red-500 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500 rounded-2xl text-emerald-500 text-sm">
          Settings synchronized successfully!
        </div>
      )}

      {/* Profile & Rates Settings */}
      <motion.form
        onSubmit={handleConfigSubmit}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181818] p-6 rounded-2xl border border-separator/20 space-y-6"
      >
        <h3 className="text-xl font-bold text-white border-b border-separator/10 pb-3 flex items-center gap-2">
          <FaRocket className="text-emerald-500 text-lg" /> Freelance Profile Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Freelance Status
            </label>
            <input
              type="text"
              name="status"
              defaultValue={config.status}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Accepting Freelance Projects"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              name="hourlyRate"
              defaultValue={config.hourlyRate}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Project Starting Rate ($)
            </label>
            <input
              type="number"
              name="projectStartingPrice"
              defaultValue={config.projectStartingPrice}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 1500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Freelance Biography / Focus Text
          </label>
          <textarea
            name="bio"
            defaultValue={config.bio}
            required
            rows="3"
            className="w-full bg-[#2A2A2A] text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Introduce your freelance studio, what products you specialize in, and what problems you solve for clients."
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md shadow-emerald-500/15"
        >
          <FaSave className="text-sm" /> Save Profile Info
        </button>
      </motion.form>

      {/* Services offered list & manager */}
      <div className="space-y-6 border-t border-separator/15 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCode className="text-emerald-500 text-lg" /> Freelance Services & Packages
          </h3>
          <button
            onClick={() => {
              setEditingService(null);
              setIsAddingService(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FaPlus className="text-xs" /> Add New Package
          </button>
        </div>

        {/* Services Create/Edit form */}
        {(isAddingService || editingService) && (
          <ServiceForm
            service={editingService || {}}
            onSave={handleSaveService}
            onCancel={() => {
              setEditingService(null);
              setIsAddingService(false);
            }}
          />
        )}

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.services.map((service) => {
            const Icon = iconMap[service.icon] || FaCode;
            return (
              <div key={service.id} className="bg-[#181818] border border-separator/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <Icon className="text-xl" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {service.duration}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white leading-tight">{service.title}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">{service.description}</p>
                  
                  {/* Features display */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {service.features?.map((f, i) => (
                      <span key={i} className="text-[10px] text-gray-300 font-semibold px-2 py-0.5 bg-[#2A2A2A] rounded border border-separator/10">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-separator/10 pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Starts at</span>
                    <span className="text-xl font-black text-emerald-400">${service.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingService(service);
                      }}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all duration-300 border border-emerald-500/15"
                      title="Edit Service"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-500/15"
                      title="Delete Service"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "How I Work" Process Flow settings */}
      <div className="space-y-6 border-t border-separator/15 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaListOl className="text-emerald-500 text-lg" /> "How I Work" Process Steps
          </h3>
          <button
            onClick={() => {
              setEditingProcessStep(null);
              setIsAddingProcessStep(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FaPlus className="text-xs" /> Add New Step
          </button>
        </div>

        {/* Process Create/Edit Form */}
        {(isAddingProcessStep || editingProcessStep) && (
          <ProcessStepForm
            step={editingProcessStep || {}}
            onSave={handleSaveProcessStep}
            onCancel={() => {
              setEditingProcessStep(null);
              setIsAddingProcessStep(false);
            }}
          />
        )}

        {/* Process Steps List */}
        <div className="space-y-4">
          {(config.process || []).map((step, index) => (
            <div key={step.id || index} className="bg-[#181818] border border-separator/20 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{step.title}</h4>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-11">{step.description}</p>
              </div>

              <div className="flex gap-2 pl-11 sm:pl-0">
                <button
                  onClick={() => {
                    setIsAddingProcessStep(false);
                    setEditingProcessStep(step);
                  }}
                  className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all duration-300 border border-emerald-500/15"
                  title="Edit Step"
                >
                  <FaEdit className="text-xs" />
                </button>
                <button
                  onClick={() => handleDeleteProcessStep(step.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-500/15"
                  title="Delete Step"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
          {(!config.process || config.process.length === 0) && (
            <p className="text-zinc-500 text-xs sm:text-sm italic">No process steps configured yet. Click "Add New Step" to define your process.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceForm = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: service.title || '',
    description: service.description || '',
    price: service.price || '',
    duration: service.duration || '',
    features: service.features ? service.features.join(', ') : '',
    icon: service.icon || 'code'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#212121] p-6 rounded-2xl border border-separator/30 space-y-5"
    >
      <h4 className="text-lg font-bold text-white border-b border-separator/10 pb-2">
        {service.id ? 'Edit Service Package' : 'Create New Service Package'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Service Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. SaaS MVP Development"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Package Icon</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="code">Code Block (FaCode)</option>
            <option value="rocket">Rocket Ship (FaRocket)</option>
            <option value="brain">Brain AI (FaBrain)</option>
            <option value="database">Database (FaDatabase)</option>
            <option value="mobile">Mobile Phone (FaMobileAlt)</option>
            <option value="server">Cloud Server (FaServer)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Starting Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. 2500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Timeline/Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. 3-4 weeks"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows="3"
          className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="Explain what the package entails, who it is for, and the values it delivers."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Features (comma-separated)</label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="e.g. Stripe checkout, Stripe webhooks, MongoDB integration, Tailwind CSS layouts"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl transition-colors"
        >
          Save Package
        </button>
      </div>
    </motion.form>
  );
};

const ProcessStepForm = ({ step, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: step.title || '',
    description: step.description || '',
    stepNumber: step.stepNumber || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#212121] p-6 rounded-2xl border border-separator/30 space-y-5"
    >
      <h4 className="text-lg font-bold text-white border-b border-separator/10 pb-2">
        {step.id ? 'Edit Process Step' : 'Create New Process Step'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-400 mb-1">Step Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. Alignment & Scope"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Step Number (Order)</label>
          <input
            type="number"
            value={formData.stepNumber}
            onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. 1"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows="3"
          className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          placeholder="Detail what happens during this step of the project workflow."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl transition-colors"
        >
          Save Step
        </button>
      </div>
    </motion.form>
  );
};

export default FreelanceManager;
