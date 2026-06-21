"use client";
import React, { useState, useRef, useEffect } from "react";
import GithubIcon from "../../public/github-icon.svg";
import LinkedinIcon from "../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";
import { usePortfolioMode } from "../contexts/PortfolioModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { fetchFreelanceConfig } from "../services/firebase";

const EmailSection = () => {
    const { t } = useLanguage();
    const { isFreelance } = usePortfolioMode();
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [projectType, setProjectType] = useState("SaaS MVP Development");
    const [projectBudget, setProjectBudget] = useState("$2,000 - $5,000");
    const [services, setServices] = useState([]);

    useEffect(() => {
        if (isFreelance) {
            const loadServices = async () => {
                try {
                    const data = await fetchFreelanceConfig();
                    if (data && data.services && data.services.length > 0) {
                        setServices(data.services);
                        setProjectType(data.services[0].title);
                    }
                } catch (error) {
                    console.error("Error loading freelance services for contact form:", error);
                }
            };
            loadServices();
        }
    }, [isFreelance]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");
        const subject = formData.get("subject") || "";

        const payload = {
            name,
            email,
            message,
            isFreelance,
            ...(isFreelance 
                ? { projectType, projectBudget } 
                : { subject }
            )
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setEmailSubmitted(true);
                e.target.reset();
            } else {
                const result = await response.json();
                throw new Error(result.error || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setError(error.message || t("contact.error", "Failed to send message. Please try again."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            id="contact"
            className="grid grid-cols-1 lg:grid-cols-2 my-8 sm:my-12 py-12 sm:py-16 lg:py-24 gap-8 lg:gap-4 relative px-4 sm:px-6 text-primary"
        >
            <div className={`hidden dark:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent rounded-full h-60 w-60 sm:h-80 sm:w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2 transition-colors duration-500 ${
                isFreelance ? 'from-emerald-900/10' : 'from-blue-900/10'
            }`}></div>
            <div className="z-10 flex flex-col justify-center">
                <h5 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary my-2">
                    {isFreelance ? t('contact.titleFreelance', "Let's Build Your Project") : t('contact.title', "Let's Connect")}
                </h5>
                <p className="text-secondary mb-6 max-w-xl text-base sm:text-lg leading-relaxed">
                    {isFreelance 
                        ? t('contact.descFreelance', "Have an idea for a SaaS MVP, dynamic web application, or custom AI system? Fill out the intake form to get a quick estimate and kickstart development!") 
                        : t('contact.desc', "I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!")
                    }
                </p>
                <div className="socials flex flex-row gap-3">
                    <Link href="https://github.com/ldbtech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-separator dark:border-zinc-800 bg-transparent hover:bg-surface-secondary transition-colors shadow-sm">
                        <Image src={GithubIcon} alt="Github Icon" className="w-5 h-5 sm:w-6 sm:h-6 invert dark:invert-0 opacity-80 group-hover:opacity-100" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/alidaho/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-separator dark:border-zinc-800 bg-transparent hover:bg-surface-secondary transition-colors shadow-sm">
                        <Image src={LinkedinIcon} alt="Linkedin Icon" className="w-5 h-5 sm:w-6 sm:h-6 invert dark:invert-0 opacity-80 group-hover:opacity-100" />
                    </Link>
                </div>
            </div>
            <div className="z-10">
                {emailSubmitted ? (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-3xl p-6 text-center shadow-md">
                        <p className="text-green-700 dark:text-green-400 font-semibold text-sm sm:text-base">
                            {isFreelance 
                                ? t('contact.successFreelance', "Thank you! I have received your project details and will send over a proposal within 24 hours.")
                                : t('contact.success', "Thank you for your message! I'll get back to you soon.")
                            }
                        </p>
                    </div>
                ) : (
                    <form
                        className={`flex flex-col space-y-5 sm:space-y-6 bg-glass border border-separator/40 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ${
                            isFreelance ? 'hover:border-emerald-500/25' : 'hover:border-blue-500/25'
                        }`}
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-semibold text-secondary"
                            >
                                {t('contact.name', 'Your Name')}
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                required
                                className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                placeholder={t('contact.namePlaceholder', 'Your Name')}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-semibold text-secondary"
                            >
                                {t('contact.email', 'Your email')}
                            </label>
                            <input
                                name="email"
                                type="email"
                                id="email"
                                required
                                className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                placeholder="example@domain.com"
                            />
                        </div>

                        {isFreelance ? (
                            /* Freelance custom fields */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-secondary">
                                        {t('contact.projectType', 'Project Type')}
                                    </label>
                                    <select
                                        value={projectType}
                                        onChange={(e) => setProjectType(e.target.value)}
                                        className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all cursor-pointer"
                                    >
                                        {services.length > 0 ? (
                                            services.map((service) => (
                                                <option key={service.id || service.title} value={service.title}>
                                                    {service.title}
                                                </option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="SaaS MVP Development">SaaS MVP Development</option>
                                                <option value="AI Automation & LLMs">AI Automation & LLMs</option>
                                                <option value="Premium Web App">Premium Web App</option>
                                                <option value="Custom API / Integration">Custom API / Integration</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-secondary">
                                        {t('contact.projectBudget', 'Estimated Budget')}
                                    </label>
                                    <select
                                        value={projectBudget}
                                        onChange={(e) => setProjectBudget(e.target.value)}
                                        className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all cursor-pointer"
                                    >
                                        <option value="Under $1,000">Under $1,000</option>
                                        <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                                        <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                                        <option value="$5,000+">$5,000+</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            /* Career mode standard subject */
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm mb-2 font-semibold text-secondary"
                                >
                                    {t('contact.subject', 'Subject')}
                                </label>
                                <input
                                    name="subject"
                                    type="text"
                                    id="subject"
                                    required
                                    className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                    placeholder={t('contact.subjectPlaceholder', 'Just saying hi')}
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm mb-2 font-semibold text-secondary"
                            >
                                {isFreelance ? t('contact.messageFreelance', 'Project Requirements Description') : t('contact.message', 'Message')}
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                className={`bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 resize-none shadow-sm focus:outline-none focus:ring-2 transition-all ${
                                    isFreelance ? 'focus:ring-emerald-500/40 focus:border-emerald-500' : 'focus:ring-accent/40 focus:border-accent'
                                }`}
                                placeholder={isFreelance ? t('contact.messageFreelancePlaceholder', "Tell me about the product you want to build...") : t('contact.messagePlaceholder', "Let's talk about...")}
                                rows="4"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
                                <p className="text-red-700 dark:text-red-500 text-xs sm:text-sm">{error}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`font-semibold py-3.5 px-6 rounded-2xl w-full transition-all duration-300 text-sm sm:text-base shadow-lg ${
                                isFreelance 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/15 hover:shadow-emerald-500/25'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/15 hover:shadow-blue-500/25'
                            } ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? t('contact.sending', 'Sending...') : (isFreelance ? t('contact.sendFreelance', 'Submit Inquiry') : t('contact.send', 'Send Message'))}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default EmailSection;