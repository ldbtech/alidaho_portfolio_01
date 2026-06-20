"use client";
import React, { useState, useRef, useEffect } from "react";
import GithubIcon from "../../public/github-icon.svg";
import LinkedinIcon from "../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";
import emailjs from '@emailjs/browser';

const EmailSection = () => {
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const formRef = useRef();

    useEffect(() => {
        // Initialize EmailJS with your public key
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        emailjs.init(publicKey);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            const result = await emailjs.sendForm(
                serviceId,
                templateId,
                formRef.current,
                publicKey
            );

            if (result.text === 'OK') {
                setEmailSubmitted(true);
                e.target.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setError("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            id="contact"
            className="grid grid-cols-1 lg:grid-cols-2 my-8 sm:my-12 py-12 sm:py-16 lg:py-24 gap-8 lg:gap-4 relative px-4 sm:px-6 text-primary"
        >
            <div className="hidden dark:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent rounded-full h-60 w-60 sm:h-80 sm:w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
            <div className="z-10 flex flex-col justify-center">
                <h5 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary my-2">
                    Let&apos;s Connect
                </h5>
                <p className="text-secondary mb-6 max-w-xl text-base sm:text-lg leading-relaxed">
                    I&apos;m currently looking for new opportunities, my inbox is always
                    open. Whether you have a question or just want to say hi, I&apos;ll
                    try my best to get back to you!
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
                            Thank you for your message! I&apos;ll get back to you soon.
                        </p>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        className="flex flex-col space-y-5 sm:space-y-6 bg-glass border border-separator/40 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-semibold text-secondary"
                            >
                                Your Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                required
                                className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-semibold text-secondary"
                            >
                                Your email
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
                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm mb-2 font-semibold text-secondary"
                            >
                                Subject
                            </label>
                            <input
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                placeholder="Just saying hi"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm mb-2 font-semibold text-secondary"
                            >
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                className="bg-surface-secondary/40 dark:bg-[#121215]/40 border border-separator/50 dark:border-zinc-800/60 text-primary placeholder-tertiary text-sm rounded-2xl block w-full p-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                                placeholder="Let's talk about..."
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
                            className={`bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-2xl w-full transition-all duration-300 text-sm sm:text-base shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default EmailSection;