"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridIcon from "@/components/GridIcon";
import Dialog from "@/components/Dialog";

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

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);

  const apps: AppData[] = [
    { id: 1, x: 1, y: 1, width: 2, height: 2, title: "About Me", icon: "/bush.jpg", content: "Hi, I’m Austin Wheeler — currently a software engineer at Netflix with a focus on datastores. Additionally, I've interned at places like Amazon and have experience in building web and mobile apps at a handful of scrappy startups. I graduated in December 2025, and outside of code, I spend my time climbing, training jiu-jitsu, watching anime, and hanging out with my dog Daisy." },
    { id: 2, x: 3, y: 1, width: 1, height: 1, title: "Snorlax", subtitle: "My favorite pokemon", icon: "/snorlax.jpg", content: "I just wanted to add snorlax somewhere lol... I keep three cards of him on desk as well." },
    { id: 3, x: 1, y: 5, width: 2, height: 2, title: "Netflix", subtitle: "2024 Intern and Current Full-Time", icon: "/netflix.png", content: "At Netflix, I built a system that automatically scans and cleans up massive data sets in the background—without disrupting live traffic.\n The goal was to help teams manage 'wide rows' (unusually large pieces of data) by finding and trimming them down based on policies they set.\n I designed this scanner to be safe in high-traffic environments, using real-time CPU feedback to automatically slow down or speed up depending on how busy the servers were.\n This allowed us to run cleanup jobs across the entire Key-Value platform without impacting performance, helping improve system reliability and reduce memory overhead at scale.\n Now I am a full-time employee on the Netflix Caching Team working on technologies like Hollow OSS." },
    { id: 5, x: 3, y: 2, width: 1, height: 1, title: "ConnectPlus", subtitle: "HSE (会说English)", icon: "/hse.png", content: "ConnectPlus is a nonprofit platform that matches Chinese students with volunteer English tutors from U.S. high schools, making high-quality language education more accessible and affordable. Designed with both communities in mind, the platform supports seamless scheduling, class tracking, and progress monitoring, while offering American high schoolers a meaningful way to earn volunteer hours and make a global impact through language learning. For students, we provide a platform with completely free lessons to those with learning disabilities." },
    { id: 6, x: 4, y: 1, width: 1, height: 1, title: "Warden", subtitle: "Lightweigth Alerting", icon: "/groudon.png", content: "Warden is a lightweight alerting and logging service for frontend apps—designed to get developers up and running in minutes. Built for small teams and solo developers, it captures logs and errors from JavaScript, Swift, and more, then triggers real-time alerts via rules you define. Whether you're watching for database timeouts or unexpected crashes, Warden lets you instantly notify your team (even via SMS) and trace issues with searchable metadata, all without the complexity of traditional monitoring tools." },
    { id: 7, x: 3, y: 3, width: 2, height: 2, title: "Amazon", subtitle: "Internship", icon: "/amazon.jpg", content: "At Amazon, I helped simplify VPC data storage that was spread across roughly a thousand servers, each running its own copy of the same MySQL tables.\n I redesigned a key set of those tables for DynamoDB, creating cloud-native layouts that matched how our applications actually read and wrote data.\n After migrating the data and updating our billing APIs to use the new store, every server could pull from a single, highly available source instead of keeping its own replica.\n The change made the system noticeably snappier for customers, cut a large chunk of operational overhead, and paved the way for future teams to move the rest of their data with confidence." },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative max-w-screen min-h-screen bg-cover bg-center" 
           style={{ backgroundImage: "url('/bg.JPG')" }}>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
        
        <div className="relative z-10 px-6 pt-16 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-white text-lg font-medium">12:48</h1>
            <p className="text-white/80 text-sm">Wednesday, July 7</p>
          </motion.div>

          <div className="relative" style={{ height: "640px" }}>
            {apps.map((app, index) => (
              <GridIcon
                key={app.id}
                app={app}
                onClick={() => setSelectedApp(app)}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <Dialog
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}