"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCode, FaServer, FaDatabase, FaTrophy, FaGraduationCap, FaBriefcase, FaGlobe, FaFootballBall, FaRocket, FaBrain, FaMobileAlt } from "react-icons/fa";
import { fetchData, getVisitorCount, fetchFreelanceConfig } from "../services/firebase";
import { useLanguage } from "../contexts/LanguageContext";
import { usePortfolioMode } from "../contexts/PortfolioModeContext";
import LoadingState from "./LoadingState";

const iconMap = {
  rocket: FaRocket,
  brain: FaBrain,
  code: FaCode,
  database: FaDatabase,
  mobile: FaMobileAlt,
  server: FaServer
};

const AboutSection = () => {
  const { t } = useLanguage();
  const { isFreelance } = usePortfolioMode();
  const [content, setContent] = useState(null);
  const [freelanceConfig, setFreelanceConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const [expandedExp, setExpandedExp] = useState({ 0: true });
  const [expandedEdu, setExpandedEdu] = useState({ 0: true });

  const toggleExp = (index) => {
    setExpandedExp(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleEdu = (index) => {
    setExpandedEdu(prev => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [data, visits, freelanceData] = await Promise.all([
          fetchData('about'),
          getVisitorCount(),
          fetchFreelanceConfig()
        ]);
        setVisitorCount(visits);
        setFreelanceConfig(freelanceData);

        if (data) {
          setContent({
            bio: data.bio || '',
            images: {
              profile: data.images?.profile || '',
              aboutMe: data.images?.aboutMe || '',
              background: data.images?.background || '',
              additional: data.images?.additional || []
            },
            skillGroups: Array.isArray(data.skillGroups) ? data.skillGroups : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            education: Array.isArray(data.education) ? data.education : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
            programmingLanguages: Array.isArray(data.programmingLanguages) ? data.programmingLanguages : [],
            spokenLanguages: Array.isArray(data.spokenLanguages) ? data.spokenLanguages : [],
            aiTools: Array.isArray(data.aiTools) ? data.aiTools : []
          });
        }
      } catch (err) {
        console.error('Error loading about content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderDescription = (description) => {
    if (!description) return null;
    const lines = description.split('\n').filter(line => line.trim());
    const hasBulletPoints = lines.some(line => 
      line.trim().startsWith('- ') || 
      line.trim().startsWith('• ') || 
      line.trim().startsWith('* ')
    );
    
    if (hasBulletPoints) {
      return (
        <ul className="mt-2 space-y-1 text-xs sm:text-sm">
          {lines.map((line, index) => {
            const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
            return (
              <li key={index} className="text-secondary flex items-start">
                <span className="text-accent mr-2 mt-1">•</span>
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    return <p className="mt-2 text-secondary text-xs sm:text-sm leading-relaxed">{description}</p>;
  };

  if (loading) {
    return (
      <section id="about" className="py-16 bg-theme">
        <LoadingState message="Loading stats & bio..." />
      </section>
    );
  }

  if (error || !content) {
    return (
      <section id="about" className="py-16">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load content'}</p>
        </div>
      </section>
    );
  }

  // Helper to extract year from period string to allow chronological sorting
  const extractYear = (periodString) => {
    if (!periodString) return 0;
    const lowerPeriod = periodString.toLowerCase();
    if (lowerPeriod.includes("present") || lowerPeriod.includes("current") || lowerPeriod.includes("now")) {
      return 9999;
    }
    const years = periodString.match(/\b\d{4}\b/g);
    if (!years || years.length === 0) return 0;
    return Math.max(...years.map(Number));
  };

  const sortedExperiences = content.experience && content.experience.length > 0
    ? [...content.experience].sort((a, b) => extractYear(b.period) - extractYear(a.period))
    : [];

  const sortedEducation = content.education && content.education.length > 0
    ? [...content.education].sort((a, b) => extractYear(b.period) - extractYear(a.period))
    : [];

  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 space-y-8 sm:space-y-12" id="about">
      {/* Title */}
      <div className="text-center space-y-4 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary"
        >
          {(() => {
            const title = isFreelance 
              ? t('about.titleFreelance', 'Freelance Studio')
              : t('about.title', 'About Me');
            const titleParts = typeof title === 'string' ? title.split(' ') : ['About', 'Me'];
            return (
              <>
                {titleParts[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isFreelance ? 'from-emerald-400 to-teal-500' : 'from-blue-500 to-indigo-500'}`}>{titleParts[1] || 'Me'}</span>
              </>
            );
          })()}
        </motion.h2>
        <p className="text-secondary text-sm sm:text-base max-w-xl mx-auto">
          {isFreelance 
            ? "Explore how I build, design, and deploy client-focused solutions and custom code packages."
            : "A glimpse into my background, core expertise, and technical journey."
          }
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4">
        
        {/* Box 1: Profile & Bio (col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`bg-glass rounded-3xl p-6 md:p-8 md:col-span-2 border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(59,130,246,0.06)] transition-all duration-300 group ${
            isFreelance ? 'hover:border-emerald-500/20' : 'hover:border-blue-500/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-zinc-200 dark:border-zinc-800">
              {content.images.aboutMe && !imageError ? (
                <Image
                  src={content.images.aboutMe}
                  alt="Ali Daho"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={handleImageError}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${isFreelance ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-theme'}`}>
                  AD
                </div>
              )}
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <span className={`px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${
                isFreelance 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {isFreelance ? t('about.subtitleFreelance', 'Full-Stack Studio') : t('about.subtitle', 'Full Stack & AI Engineer')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-primary">Ali Daho Bachir</h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                {isFreelance && freelanceConfig?.bio 
                  ? freelanceConfig.bio 
                  : (content.bio || "I'm a passionate Software Engineer focused on building intelligent web and mobile solutions.")
                }
              </p>
            </div>
          </div>
          
          {/* Stats Bar (Swaps dynamically under freelance mode) */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-zinc-200/60 dark:border-zinc-800/40 text-center">
            <div>
              <span className={`block text-2xl font-extrabold ${isFreelance ? 'text-emerald-500' : 'text-blue-500'}`}>
                {isFreelance 
                  ? (freelanceConfig?.hourlyRate ? `$${freelanceConfig.hourlyRate}/hr` : '$50/hr')
                  : `${content.experience.length}+`
                }
              </span>
              <span className="text-[10px] text-tertiary uppercase tracking-wider font-semibold">
                {isFreelance ? t('about.hourlyRate', 'Hourly Rate') : t('about.rolesHeld', 'Roles Held')}
              </span>
            </div>
            <div>
              <span className={`block text-2xl font-extrabold ${isFreelance ? 'text-teal-400' : 'text-emerald-500'}`}>
                {isFreelance 
                  ? (freelanceConfig?.projectStartingPrice ? `$${freelanceConfig.projectStartingPrice}+` : '$1500+')
                  : '9+'
                }
              </span>
              <span className="text-[10px] text-tertiary uppercase tracking-wider font-semibold">
                {isFreelance ? t('about.startingPrice', 'Starting Project') : t('about.activeProjects', 'Active Projects')}
              </span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-indigo-500">
                {visitorCount || 420}
              </span>
              <span className="text-[10px] text-tertiary uppercase tracking-wider font-semibold">{t('about.profileVisits', 'Profile Visits')}</span>
            </div>
          </div>
        </motion.div>

        {/* Box 2: Tech Stack (col-span-1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`bg-glass rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(139,92,246,0.06)] transition-all duration-300 group ${
            isFreelance ? 'hover:border-emerald-500/20' : 'hover:border-purple-500/20'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isFreelance ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                <FaCode className="text-lg" />
              </div>
              <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.techStack', 'Tech Stack')}</h3>
            </div>
            
            <div className="space-y-3">
              {/* Programming Languages */}
              {content.programmingLanguages.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {content.programmingLanguages.map((lang, i) => (
                    <span key={i} className={`px-2.5 py-1 border rounded-lg text-xs font-semibold ${
                      isFreelance 
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                    }`}>
                      {lang.language}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Core Skill Categories */}
              <div className="flex flex-wrap gap-1.5">
                {content.skillGroups.flatMap(g => g.items || []).slice(0, 8).map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>

              {/* AI & Tools */}
              {content.aiTools.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {content.aiTools.slice(0, 4).map((tool, i) => (
                    <span key={i} className="px-2.5 py-1 bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-semibold">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-tertiary mt-4 leading-normal">
            {t('about.specialization', 'Ali specializes in full-stack setups, convolutional neural nets, and real-time simulator codebases.')}
          </p>
        </motion.div>

        {/* Box 3: Experience & Education Journey OR Freelance Services (col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`bg-glass rounded-3xl p-6 md:p-8 md:col-span-2 border border-zinc-200 dark:border-zinc-800/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.06)] transition-all duration-300 group ${
            isFreelance ? 'hover:border-emerald-500/20' : 'hover:border-blue-500/20'
          }`}
        >
          {isFreelance ? (
            /* Freelance Services Offered Layout */
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FaRocket className="text-lg" />
                </div>
                <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.freelanceServices', 'Services & Packages')}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {freelanceConfig?.services?.map((service, index) => {
                  const Icon = iconMap[service.icon] || FaCode;
                  return (
                    <div key={service.id || index} className="p-4 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 hover:border-emerald-500/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Icon className="text-sm" />
                          </div>
                          <h4 className="font-bold text-primary text-sm sm:text-base leading-tight">{service.title}</h4>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15 uppercase tracking-wide">
                            {service.duration}
                          </span>
                        </div>
                        <p className="text-secondary text-xs leading-relaxed">{service.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {service.features?.map((feat, i) => (
                            <span key={i} className="text-[9px] text-tertiary px-2 py-0.5 bg-zinc-200/40 dark:bg-zinc-800/30 rounded border border-separator/10">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 border-separator/10 pt-2 sm:pt-0">
                        <span className="block text-[9px] text-tertiary font-bold uppercase tracking-wider">Starts at</span>
                        <span className="text-xl font-black text-emerald-400">${service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Career Experience & Education Timeline Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Experience Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <FaBriefcase className="text-lg" />
                  </div>
                  <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.workExperience', 'Work Experience')}</h3>
                </div>

                {sortedExperiences.length > 0 ? (
                  <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800/60 space-y-6">
                    {sortedExperiences.map((exp, index) => {
                      const isExpanded = !!expandedExp[index];
                      return (
                        <div 
                          key={index} 
                          className="relative group/item cursor-pointer"
                          onClick={() => toggleExp(index)}
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border border-white dark:border-zinc-950 shadow-md group-hover/item:scale-110 transition-transform" />
                          
                          <div className="space-y-1 select-none">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <h4 className="font-bold text-primary text-sm sm:text-base group-hover/item:text-blue-400 transition-colors flex items-center gap-1.5">
                                {exp.title}
                                <span className="text-[10px] text-zinc-500 font-normal transition-transform duration-300">
                                  {isExpanded ? "▲" : "▼"}
                                </span>
                              </h4>
                              <span className="text-[11px] text-tertiary font-semibold">{exp.period}</span>
                            </div>
                            <span className="text-xs font-semibold text-blue-400 block">{exp.company}</span>
                            
                            <motion.div
                              initial={false}
                              animate={{ 
                                height: isExpanded ? "auto" : 0, 
                                opacity: isExpanded ? 1 : 0,
                                marginTop: isExpanded ? "0.5rem" : 0
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden text-xs sm:text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {renderDescription(exp.description)}
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-tertiary">{t('about.noExperience', 'No experience configured.')}</p>
                )}
              </div>

              {/* Education Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FaGraduationCap className="text-lg" />
                  </div>
                  <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.educationLabel', 'Education')}</h3>
                </div>

                {sortedEducation.length > 0 ? (
                  <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800/60 space-y-6">
                    {sortedEducation.map((edu, index) => {
                      const isExpanded = !!expandedEdu[index];
                      return (
                        <div 
                          key={index} 
                          className="relative group/item cursor-pointer"
                          onClick={() => toggleEdu(index)}
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border border-white dark:border-zinc-950 shadow-md group-hover/item:scale-110 transition-transform" />
                          
                          <div className="space-y-1 select-none">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <h4 className="font-bold text-primary text-sm sm:text-base group-hover/item:text-indigo-400 transition-colors flex items-center gap-1.5">
                                {edu.degree}
                                <span className="text-[10px] text-zinc-500 font-normal transition-transform duration-300">
                                  {isExpanded ? "▲" : "▼"}
                                </span>
                              </h4>
                              <span className="text-[11px] text-tertiary font-semibold">{edu.period}</span>
                            </div>
                            <span className="text-xs font-semibold text-indigo-400 block">{edu.school}</span>
                            
                            <motion.div
                              initial={false}
                              animate={{ 
                                height: isExpanded ? "auto" : 0, 
                                opacity: isExpanded ? 1 : 0,
                                marginTop: isExpanded ? "0.5rem" : 0
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden text-xs sm:text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {renderDescription(edu.description)}
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-tertiary">{t('about.noEducation', 'No education configured.')}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Box 4: Spoken Languages & Striker Badge OR How I Work (col-span-1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className={`bg-glass rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group ${
            isFreelance ? 'hover:border-emerald-500/20' : 'hover:border-emerald-500/20'
          }`}
        >
          {isFreelance ? (
            /* Freelance How I Work Process Flow Layout */
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FaBriefcase className="text-lg" />
                </div>
                <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.howIWork', 'How I Work')}</h3>
              </div>
              
              <div className="relative pl-4 border-l-2 border-emerald-500/20 space-y-5 text-xs">
                {(freelanceConfig?.process || []).map((step, index) => (
                  <div key={step.id || index} className="relative">
                    <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                    <span className="block font-bold text-primary">{step.stepNumber}. {step.title}</span>
                    <span className="text-secondary text-[11px] leading-snug block mt-0.5">{step.description}</span>
                  </div>
                ))}
                {(!freelanceConfig?.process || freelanceConfig.process.length === 0) && (
                  <p className="text-tertiary text-xs italic">No process steps configured yet.</p>
                )}
              </div>
            </div>
          ) : (
            /* Career Languages & Striker Fun Badge Layout */
            <>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <FaGlobe className="text-lg" />
                  </div>
                  <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.languagesLabel', 'Languages & Fun')}</h3>
                </div>
                
                {/* Languages lists */}
                <div className="space-y-3">
                  {content.spokenLanguages && content.spokenLanguages.length > 0 ? (
                    content.spokenLanguages.map((lang, index) => {
                      const flagMap = {
                        english: "🇬🇧",
                        french: "🇫🇷",
                        arabic: "🇩🇿",
                        russian: "🇷🇺",
                        spanish: "🇪🇸",
                        german: "🇩🇪",
                        italian: "🇮🇹",
                        chinese: "🇨🇳",
                        japanese: "🇯🇵",
                        korean: "🇰🇷",
                        portuguese: "🇵🇹",
                        hindi: "🇮🇳"
                      };
                      const normalizedLang = lang.language?.toLowerCase().trim() || "";
                      const flag = flagMap[normalizedLang] || "🗣️";
                      
                      return (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-secondary font-medium">{flag} {lang.language}</span>
                          <span className="text-tertiary">{lang.level}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-tertiary">{t('about.noLanguages', 'No languages configured.')}</p>
                  )}
                </div>
              </div>

              {/* Soccer badge card */}
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/40 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <FaFootballBall className="text-amber-500 text-lg animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <span className="block text-xs font-extrabold text-primary">{t('about.striker', 'Best Striker ⚽️')}</span>
                  <span className="text-[10px] text-tertiary leading-none block">{t('about.strikerDesc', 'Earned on the local pitch')}</span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Box 5: Education & Highlights (col-span-3) */}
        {content.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`bg-glass rounded-3xl p-6 md:p-8 md:col-span-3 border border-zinc-200 dark:border-zinc-800/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)] transition-all duration-300 group ${
              isFreelance ? 'hover:border-emerald-500/20' : 'hover:border-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <FaTrophy className="text-lg" />
              </div>
              <h3 className="font-bold text-primary text-base sm:text-lg">{t('about.achievementsLabel', 'Achievements & Highlights')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800/60 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <FaTrophy className="text-amber-400 text-base shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-primary text-sm leading-tight mb-1">{achievement.title}</h4>
                      {achievement.category && (
                        <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-semibold mb-2 uppercase">{achievement.category}</span>
                      )}
                      {achievement.description && (
                        <p className="text-secondary text-xs leading-relaxed line-clamp-3">{achievement.description}</p>
                      )}
                      {achievement.link && (
                        <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-blue-400 text-xs font-semibold hover:underline">
                          View details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default AboutSection;