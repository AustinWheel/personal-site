"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridIcon from "@/components/GridIcon";
import Dialog from "@/components/Dialog";

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

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long',
      day: 'numeric'
    });
  };

  const apps: AppData[] = [
    { id: 1, x: 1, y: 1, width: 2, height: 2, title: "About Me", icon: "/bush.jpg", content: "Hi, I’m Austin Wheeler — currently a software engineer at Netflix with a focus on datastores. Additionally, I've interned at places like Amazon and have experience in building web and mobile apps at a handful of scrappy startups. I graduated in December 2025, and outside of code, I spend my time climbing, training jiu-jitsu, watching anime, and hanging out with my dog Daisy." },
    { id: 2, x: 3, y: 1, width: 1, height: 1, title: "Snorlax", subtitle: "My favorite pokemon", icon: "/snorlax.jpg", content: "I just wanted to add snorlax somewhere lol... I keep three cards of him on desk as well." },
    { 
      id: 3, 
      x: 1, 
      y: 3, 
      width: 2, 
      height: 2, 
      title: "Netflix", 
      subtitle: "2024 Intern and Current Full-Time", 
      icon: "/netflix.png", 
      content: "I started at Netflix as an intern with KeyValue, and am now a Full Time Software Engineer on our Caching Datastore team.",
      projects: [
        {
          title: "Wide Row Scanner",
          description: [
            { type: 'text', content: "Created a background scanner for Netflix's Key-Value platform to solve 'wide rows' - an unusually large amount of columns common with Cassandra which decrease system performance." },
            { type: 'text', content: "Scanning comes with many costs, potential latency increases, additional cluster pressure, not to mention the zero tolerance for errors when deleting data. To handle pressure and latency I implemented CPU based backoff, once CPU reaches a dangerous level, we drop scan speeds until the cluster returns to a healthy range." },
            { type: 'image', src: '/BGScannerBackpressure.jpg', alt: 'Wide Row Scanner Backpressure' },
            { type: 'text', content: "The next major challenge is the scale of deletes. When data is deleted from Cassandra, a 'tombstone' is created. The data won't be removed until 'compaction' at a later time. This creates an issue when querying a page of data, as C* wants to fill it up before returning, however when there are millions of tombstones this leads to read timeouts and sections of data which are unreadable." },
            { type: 'image', src: '/TombstoneKeys.jpg', alt: 'Tombstone Keys' },
            { type: 'text', content: "To overcome this I used 'Spread-TTL' deletes. Deletes are done through KeyValue, all wide row data is 'marked' for deletion with a random ttl applied for some time range. This reduces the # of tombstones that exist at any given time, and KeyValue is able to filter out 'marked' data before returning to the client." },
            { type: 'image', src: '/SpreadTTLKeys.jpg', alt: 'SpreadTTL Keys' },
          ]
        },
        {
          title: "Hollow OSS",
          description: [
            { type: 'image', src: '/hollowoss.png', alt: 'Hollow Logo' },
            { type: 'text', content: "A contributor to Netflix's Hollow Datastore. Netflix Hollow is a java library and toolset for disseminating in-memory datasets from a single producer to many consumers for high performance read-only access. Hollow aggressively addresses the scaling challenges of in-memory datasets, and is built with servers busily serving requests at or near maximum capacity in mind." },
          ]
        },
      ]
    },
    { id: 5, x: 3, y: 2, width: 1, height: 1, title: "ConnectPlus", subtitle: "HSE (会说English)", icon: "/hse.png", content: "ConnectPlus is a nonprofit platform that matches Chinese students with volunteer English tutors from U.S. high schools, making high-quality language education more accessible and affordable. Designed with both communities in mind, the platform supports seamless scheduling, class tracking, and progress monitoring, while offering American high schoolers a meaningful way to earn volunteer hours and make a global impact through language learning. For students, we provide a platform with completely free lessons to those with learning disabilities.", link: "https://www.connectpluseducation.org" },
    { id: 6, x: 4, y: 1, width: 1, height: 1, title: "Warden", subtitle: "Lightweigth Alerting", icon: "/groudon.png", content: "Warden is a lightweight alerting and logging service for frontend apps—designed to get developers up and running in minutes. Built for small teams and solo developers, it captures logs and errors from JavaScript, Swift, and more, then triggers real-time alerts via rules you define. Whether you're watching for database timeouts or unexpected crashes, Warden lets you instantly notify your team (even via SMS) and trace issues with searchable metadata, all without the complexity of traditional monitoring tools.", link: "https://www.warden.sh" },
    { id: 7, x: 3, y: 3, width: 2, height: 2, title: "Amazon", subtitle: "Internship", icon: "/amazon.jpg", content: "At Amazon, I helped simplify VPC data storage that was spread across roughly a thousand servers, each running its own copy of the same MySQL tables.\n I redesigned a key set of those tables for DynamoDB, creating cloud-native layouts that matched how our applications actually read and wrote data.\n After migrating the data and updating our billing APIs to use the new store, every server could pull from a single, highly available source instead of keeping its own replica.\n The change made the system noticeably snappier for customers, cut a large chunk of operational overhead, and paved the way for future teams to move the rest of their data with confidence." },
  ];

  return (
    <div className="min-h-screen bg-black flex justify-center overflow-y-auto">
      <div className="flex-1 relative max-w-screen md:max-w-lg min-h-screen bg-cover bg-center" 
           style={{ backgroundImage: "url('/bg.JPG')" }}>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
        
        <div className="relative z-10 px-4 pt-16 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-white text-lg font-medium">{formatTime(currentTime)}</h1>
            <p className="text-white/80 text-sm">{formatDate(currentTime)}</p>
          </motion.div>

          <div className="relative w-full" style={{ paddingBottom: "180%" }}>
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