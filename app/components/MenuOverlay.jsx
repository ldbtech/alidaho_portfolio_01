"use client";
import React from "react";
import NavLink from "./NavLink";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const MenuOverlay = ({ links, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#121212] to-[#0a0a0a] border-b border-gray-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <FaTimes className="h-5 w-5 text-white" />
                    </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="px-4 py-6">
                    <ul className="space-y-2">
                        {links.map((link, index) => (
                            <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="w-full"
                            >
                                <NavLink 
                                    href={link.path} 
                                    title={link.title}
                                    onClick={onClose}
                                    className="block w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                />
                            </motion.li>
                        ))}
                    </ul>

                    {/* Mobile Controls */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Settings</span>
                            <div className="flex items-center gap-3">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MenuOverlay;