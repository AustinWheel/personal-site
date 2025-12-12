"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";

type ProjectContent = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string };

interface Project {
  title: string;
  tag?: string;
  description: ProjectContent[];
  subprojects?: Project[];
}

interface ProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const [viewingImage, setViewingImage] = useState<{ src: string; alt?: string } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewingImage) {
          setViewingImage(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, viewingImage]);

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
        className="relative bg-white/20 backdrop-blur-2xl rounded-t-[2.5rem] w-full max-w-lg shadow-2xl border-t border-white/20"
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{project.title}</h2>
              {project.tag && (
                <span className="text-xs px-2 py-1 bg-white/20 text-white/70 rounded-full">
                  {project.tag}
                </span>
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

          <div className="space-y-4">
            {project.description.map((item, index) => (
              <div key={index}>
                {item.type === 'text' ? (
                  <p className="text-white/90 text-lg leading-relaxed">{item.content}</p>
                ) : (
                  <button
                    onClick={() => setViewingImage({ src: item.src, alt: item.alt })}
                    className="w-full rounded-lg overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={item.src}
                      alt={item.alt || `${project.title} image ${index}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23ffffff20'/%3E%3Ctext x='200' y='100' font-family='system-ui' font-size='14' fill='%23ffffff80' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {viewingImage && (
          <ImageViewer
            src={viewingImage.src}
            alt={viewingImage.alt}
            onClose={() => setViewingImage(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}