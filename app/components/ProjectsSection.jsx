"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { fetchData } from "../services/firebase";
import LoadingState from "./LoadingState";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchData("projects");
        if (data) {
          const arr = Object.values(data).map((project) => ({
            ...project,
            tags: project.tags || [],
            imgUrl: project.imgUrl || "/placeholder.jpg",
            gitUrl: project.gitUrl || "",
            previewUrl: project.previewUrl || "",
          }));
          setProjects(arr);
        }
      } catch {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-theme">
        <LoadingState message="Assembling portfolio projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 sm:mb-14"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
            Projects
          </span>
        </h2>
        <p className="text-secondary max-w-2xl mx-auto text-sm sm:text-base">
          A selection of things I&apos;ve built — from AI pipelines to full-stack apps.
        </p>
      </motion.div>

      {projects.length === 0 ? (
        <p className="text-center text-secondary py-16">No projects yet.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {featured && <ProjectCard project={featured} featured />}
          {rest.map((project) => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default ProjectsSection;
