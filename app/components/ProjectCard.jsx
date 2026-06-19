"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

export const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProjectCard = ({ project, featured = false }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative bg-surface rounded-2xl overflow-hidden border border-separator hover:border-accent/30 transition-colors duration-300 hover:shadow-2xl hover:shadow-accent/10 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "h-56 sm:h-72" : "h-40 sm:h-48"}`}>
        <Image
          src={project.imgUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            {project.gitUrl && (
              <a href={project.gitUrl} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-black/70 text-white rounded-full hover:bg-accent transition-colors duration-200">
                <FaGithub className="text-lg" />
              </a>
            )}
            {project.previewUrl && (
              <a href={project.previewUrl} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-black/70 text-white rounded-full hover:bg-accent transition-colors duration-200">
                <FaExternalLinkAlt className="text-lg" />
              </a>
            )}
          </div>
        </div>
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 ${featured ? "sm:p-7" : ""}`}>
        <h3 className={`font-semibold mb-2 text-primary ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}>
          {project.title}
        </h3>
        <p className={`text-secondary mb-4 text-sm leading-relaxed ${featured ? "sm:text-base line-clamp-3" : "line-clamp-2"}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag, index) => (
            <span key={index}
              className="px-2.5 py-1 bg-surface-secondary text-secondary rounded-full text-xs border border-separator hover:border-accent/40 hover:text-accent transition-colors duration-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
