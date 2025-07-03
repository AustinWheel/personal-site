"use client";

import { motion } from "framer-motion";

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

interface GridIconProps {
  app: AppData;
  onClick: () => void;
  delay?: number;
}

export default function GridIcon({ app, onClick, delay = 0 }: GridIconProps) {
  const cellSize = 80;
  const gap = 20;
  
  const left = (app.x - 1) * (cellSize + gap);
  const top = (app.y - 1) * (cellSize + gap);
  const width = app.width * cellSize + (app.width - 1) * gap;
  const height = app.height * cellSize + (app.height - 1) * gap + ((app.height -1) * 20);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top + (20 * app.y)}px`,
        width: `${width}px`,
        height: `${height + 30}px`,
      }}
      className="cursor-pointer"
    >
      <motion.div
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className="active:brightness-95"
      >
        <div className="w-full rounded-[20px] shadow-lg overflow-hidden relative" style={{ height: `${height}px` }}>
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
      </motion.div>
      <p className="text-white text-xs text-center font-medium mt-2 drop-shadow-md">
        {app.title}
      </p>
    </motion.div>
  );
}