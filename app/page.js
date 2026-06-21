"use client";

import HeroSections from "./components/HeroSections";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import SplitLandingGate from "./components/SplitLandingGate";

export default function Home() {
  return (
    <main className="min-h-screen bg-theme relative">
      <SplitLandingGate />

      <Navbar />
      <div className="w-full">
        <HeroSections />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutSection />
          <ProjectsSection />
          <EmailSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}
