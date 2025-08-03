"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface Project {
  title: string;
  description: string;
}

interface ProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ 
          ease: "easeIn",
          duration: 0.3,
          opacity: { duration: 0.15 }
        }}
        className="relative bg-white/20 backdrop-blur-2xl rounded-t-[2.5rem] w-full max-w-[428px] shadow-2xl border-t border-white/20"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          WebkitBackdropFilter: 'blur(24px)', 
          height: 'min(90dvh, 90vh)',
          maxHeight: 'calc(100dvh - 2rem)'
        }}
      >
        <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="px-6 pb-6 overflow-y-auto" style={{ height: 'calc(min(90dvh, 90vh) - 60px)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">{project.title}</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-white/90 text-lg leading-relaxed">
            <p>{project.description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}