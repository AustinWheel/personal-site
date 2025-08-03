"use client";

import { motion } from "framer-motion";

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

interface GridIconProps {
  app: AppData;
  onClick: () => void;
  delay?: number;
}

export default function GridIcon({ app, onClick, delay = 0 }: GridIconProps) {
  // Grid is 4 columns x 6 rows
  const colWidth = 100 / 4; // 25%
  const rowHeight = 100 / 6; // 16.67%
  const gap = 0; // 2% gap
  
  // Calculate position and size as percentages
  const left = (app.x - 1) * colWidth;
  const top = (app.y - 1) * rowHeight;
  const width = app.width * colWidth - gap;
  const height = app.height * rowHeight - gap;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      className="cursor-pointer p-1.5"
    >
      <motion.div
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className="active:brightness-95 w-full h-full flex flex-col"
      >
        <div className="flex-1 rounded-[20px] shadow-lg overflow-hidden relative">
          {app.icon.startsWith('/') ? (
            <img 
              src={app.icon} 
              alt={app.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/90 backdrop-blur-md flex items-center justify-center">
              <span className="text-4xl select-none">{app.icon}</span>
            </div>
          )}
        </div>
        <p className="text-white text-[11px] sm:text-xs text-center font-medium mt-1 drop-shadow-md truncate">
          {app.title}
        </p>
      </motion.div>
    </motion.div>
  );
}