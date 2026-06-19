"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import NavLink from "./NavLink";
import { FaSearch, FaBars } from "react-icons/fa";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchProfile } from "../services/firebase";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import CommandPalette from "./CommandPalette";

const Navbar = () => {
    const { t } = useLanguage();
    
    const navLinks = [
        {
            title: typeof t('about', 'About') === 'string' ? t('about', 'About') : 'About',
            path: "#about",
        },
        {
            title: typeof t('projects', 'Projects') === 'string' ? t('projects', 'Projects') : 'Projects',
            path: "#projects",
        },
        {
            title: typeof t('thoughts', 'Thoughts') === 'string' ? t('thoughts', 'Thoughts') : 'Thoughts',
            path: "/thoughts",
        },
        {
            title: typeof t('contact', 'Contact') === 'string' ? t('contact', 'Contact') : 'Contact',
            path: "#contact",
        },
    ];
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profile, setProfile] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
                setProfile(null);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrolledAmount = window.scrollY > 10;
            if (scrolledAmount !== scrolled) {
                setScrolled(scrolledAmount);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    const handleImageError = () => {
        console.error('Failed to load logo image');
        setImageError(true);
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-surface-secondary/80 dark:bg-[#121212]/90 backdrop-blur-xl border-b border-separator/30 dark:border-zinc-800 shadow-lg" 
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href={"/"}
                        className="flex items-center group"
                    >
                        {profile?.logo && !imageError ? (
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
                                <Image
                                    src={profile.logo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    priority
                                    onError={handleImageError}
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
                                <span className="text-lg sm:text-xl font-bold text-white">
                                    AD
                                </span>
                            </div>
                        )}
                    </Link>
                    
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-3">
                        <button
                            onClick={() => setCommandPaletteOpen(true)}
                            className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 transition-all duration-300 text-white"
                        >
                            <FaSearch className="text-sm" />
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNavbarOpen(true)}
                            className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 transition-all duration-300"
                        >
                            <FaBars className="h-6 w-6 text-white" />
                        </motion.button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <ul className="flex items-center space-x-6">
                            {navLinks.map((link, index) => (
                                <motion.li 
                                    key={index}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <NavLink href={link.path} title={link.title} />
                                </motion.li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
                            {/* Search Button */}
                            <motion.button
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: navLinks.length * 0.1 }}
                                onClick={() => setCommandPaletteOpen(true)}
                                className="flex items-center gap-2 p-3 rounded-apple bg-surface-secondary hover:bg-surface-tertiary border border-separator/40 hover:border-accent/40 text-secondary hover:text-primary transition-apple focus-apple"
                                aria-label="Open command search"
                            >
                                <FaSearch className="text-sm" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden xl:inline">⌘K</span>
                            </motion.button>
                            
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: navLinks.length * 0.1 + 0.05 }}
                            >
                                <LanguageSwitcher />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: navLinks.length * 0.1 + 0.1 }}
                            >
                                <ThemeToggle />
                            </motion.div>
                        </div>
                    </div>

                    {/* Tablet Navigation - Show controls but hide nav links */}
                    <div className="hidden md:flex lg:hidden items-center gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCommandPaletteOpen(true)}
                                className="p-3 rounded-apple bg-surface-secondary hover:bg-surface-tertiary text-secondary hover:text-primary border border-separator/40 hover:border-accent/40 transition-apple"
                            >
                                <FaSearch className="text-sm" />
                            </button>
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
            {navbarOpen && <MenuOverlay links={navLinks} onClose={() => setNavbarOpen(false)} />}
            <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        </motion.nav>
    );
};

export default Navbar;