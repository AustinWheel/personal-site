"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

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
}

interface DialogProps {
  app: AppData;
  onClose: () => void;
}

export default function Dialog({ app, onClose }: DialogProps) {
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
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white/20 backdrop-blur-2xl rounded-t-[2.5rem] w-full max-w-[428px] h-[90vh] overflow-hidden shadow-2xl border-t border-white/20"
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="px-6 pb-6 overflow-y-auto h-[calc(90vh-60px)]">
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
    </motion.div>
  );
}