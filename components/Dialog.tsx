"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ProjectDialog from "./ProjectDialog";

type ProjectContent = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string };

interface Project {
  title: string;
  description: ProjectContent[];
}

interface AppData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  content: string;
  icon: string;
  link?: string;
  ref_photos?: string[];
  projects?: Project[];
}

interface DialogProps {
  app: AppData;
  onClose: () => void;
}

export default function Dialog({ app, onClose }: DialogProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, selectedProject]);

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          ease: "easeIn",
          duration: 0.3,
          opacity: { duration: 0.15 }
        }}
        className="relative bg-white/20 backdrop-blur-2xl rounded-t-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border-t border-white/20"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          WebkitBackdropFilter: 'blur(24px)', 
          height: 'min(90dvh, 90vh)',
          maxHeight: 'calc(100dvh - 2rem)',
        }}
      >
        <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mt-3 mb-2"/>
        
        <div className="px-6 pb-6 overflow-y-auto" style={{ height: 'calc(min(90dvh, 90vh) - 60px)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{app.title}</h2>
              {app.subtitle && (
                <p className="text-white/70 text-lg mt-1 drop-shadow-md">{app.subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {app.ref_photos && app.ref_photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {app.ref_photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white/20 rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`${app.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23ffffff20'/%3E%3Ctext x='50' y='50' font-family='system-ui' font-size='12' fill='%23ffffff80' text-anchor='middle' dominant-baseline='middle'%3EImage ${index + 1}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-white leading-relaxed">
            <p className="font-medium text-lg drop-shadow-md">{app.content}</p>
          </div>

          {app.projects && app.projects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white/70 text-sm font-medium mb-3">Projects</h3>
              <div className="space-y-2">
                {app.projects.map((project, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedProject(project)}
                    className="w-full text-left bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{project.title}</span>
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {app.link && (
            <div className="mt-6">
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <span className="font-medium">Visit Website</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
    
    <AnimatePresence>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </AnimatePresence>
    </>
  );
}