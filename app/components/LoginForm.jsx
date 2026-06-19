"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope, FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { login } from "../services/firebase";
import Link from 'next/link';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme text-primary flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Drifting decorative background blob */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-glass rounded-3xl p-6 sm:p-10 border border-separator/35 shadow-2xl flex flex-col gap-6"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tight">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Admin</span>
          </h2>
          <p className="text-secondary text-xs sm:text-sm">Sign in to update your developer profile and resume.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs sm:text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <FaEnvelope />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-secondary/70 text-primary border border-separator/45 focus:border-accent rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-500"
                placeholder="developer@domain.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Security Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <FaLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-secondary/70 text-primary border border-separator/45 focus:border-accent rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-500/15 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <FaSignInAlt className="text-xs" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="border-t border-separator/20 pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors font-medium"
          >
            <FaArrowLeft /> Back to Main Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;