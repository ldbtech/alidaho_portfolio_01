"use client";

import React, { useState, useEffect } from 'react';
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { fetchProfile, fetchData } from '../services/firebase';
import ResumePreview from './ResumePreview';
import LoadingState from './LoadingState';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSections = () => {
    const { t } = useLanguage();
    const [profile, setProfile] = useState(null);
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('HeroSections: Starting to load data...');
                const [profileData, aboutData] = await Promise.all([
                    fetchProfile(),
                    fetchData('about')
                ]);
                setProfile(profileData);
                setAbout(aboutData);
            } catch (error) {
                console.error('HeroSections: Error loading data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-theme">
                <LoadingState message="Syncing profile stats..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-400 mb-4">No Profile Data</h2>
                    <p className="text-gray-400">Please check your Firebase configuration</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-8 relative overflow-hidden">
            {/* Background — slow-drifting gradient blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(0,122,255,0.12) 0%, transparent 70%)' }}
                    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-20 w-[560px] h-[560px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(88,86,214,0.12) 0%, transparent 70%)' }}
                    animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-[420px] h-[420px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(52,199,89,0.06) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <div 
                    className="absolute inset-0 bg-[size:28px_28px]" 
                    style={{ backgroundImage: 'radial-gradient(var(--grid-dots) 1px, transparent 1px)' }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center w-full space-y-8 sm:space-y-10">
                {/* Profile Image & Status Badge Group */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                    {/* Profile Image */}
                    {profile.profileImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-500 group cursor-pointer"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-surface dark:bg-zinc-900 border-2 border-surface-secondary dark:border-zinc-950 relative">
                                {!imageError ? (
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name || "Ali Daho"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={() => setImageError(true)}
                                        unoptimized="true"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-900 flex items-center justify-center text-white text-3xl font-black">
                                        {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : "AD"}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/50 backdrop-blur-sm rounded-full border border-surface-secondary/30 text-sm text-secondary font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {t('hero.status', 'Available for opportunities')}
                        </span>
                    </motion.div>
                </div>

                {/* Name & Type Animation Group */}
                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-primary tracking-tight leading-none"
                    >
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            {profile.name || "Ali Daho"}
                        </span>
                    </motion.h1>
                    
                    {/* Type Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-10 sm:h-12 flex items-center justify-center"
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-secondary font-light">
                            <TypeAnimation
                                sequence={[
                                    profile.title,
                                    4000,
                                    "Software Developer",
                                    3000,
                                    "Best Striker ⚽️",
                                    3000,
                                    "Polyglot",
                                    2000,
                                    ...(about?.spokenLanguages ? about.spokenLanguages.flatMap(lang => [lang.language, 800]) : []),
                                    "Polyglot",
                                    2000,
                                ]}
                                wrapper="span"
                                speed={40}
                                repeat={Infinity}
                                className="text-accent"
                            />
                        </h2>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-full transition-all duration-300 hover:scale-[1.03] shadow-2xl hover:shadow-gray-500/25 w-48 sm:w-auto"
                    >
                        <FaGithub className="w-5 h-5" />
                        <span className="font-semibold">{t('hero.github', 'View GitHub')}</span>
                    </a>
                    <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all duration-300 hover:scale-[1.03] shadow-2xl hover:shadow-blue-500/25 w-48 sm:w-auto"
                    >
                        <FaLinkedin className="w-5 h-5" />
                        <span className="font-semibold">{t('hero.linkedin', 'Connect')}</span>
                    </a>
                    <div className="w-48 sm:w-auto flex justify-center">
                        <ResumePreview 
                            resumeUrl={profile.resumeUrl} 
                            resumeName={profile.resumeName || "Resume"}
                            showDownload={false}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSections;