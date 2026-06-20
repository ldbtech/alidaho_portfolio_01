'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const ResumePreview = ({ resumeUrl, resumeName = "Resume", showDownload = true }) => {
  const { t } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!resumeUrl) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePreview}
          className="group flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-apple transition-apple shadow-apple-light"
        >
          <FaEye className="w-5 h-5" />
          <span className="font-medium">{t('hero.resume', 'View Resume')}</span>
        </button>
        
        {showDownload && (
          <button
            onClick={handleDownload}
            className="group flex items-center gap-3 px-8 py-4 bg-surface-secondary hover:bg-surface-tertiary text-primary rounded-apple transition-apple shadow-apple-light"
          >
            <FaDownload className="w-5 h-5 group-hover:text-accent transition-apple" />
            <span className="font-medium">{t('hero.download', 'Download PDF')}</span>
          </button>
        )}
      </div>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl h-[90vh] bg-surface-secondary rounded-apple-lg shadow-apple overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-separator">
                <h3 className="text-xl font-semibold text-primary">{resumeName}</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-apple hover:bg-surface-tertiary transition-apple"
                >
                  <FaTimes className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Resume Content */}
              <div className="h-full overflow-hidden">
                <iframe
                  src={resumeUrl}
                  className="w-full h-full border-0"
                  title={t('resume.preview', 'Resume Preview')}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResumePreview;
