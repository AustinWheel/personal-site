"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridIcon from "@/components/GridIcon";
import Dialog from "@/components/Dialog";
import BlogApp from "@/components/BlogApp";

type ProjectContent =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string };

interface Project {
  title: string;
  tag?: string;
  description: ProjectContent[];
  subprojects?: Project[];
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
  appType?: 'blog';
}

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [blogOpen, setBlogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
    { id: 1, x: 1, y: 1, width: 2, height: 2, title: "About Me", icon: "/bush.jpg", content: "Hi, I'm Austin Wheeler — currently a software engineer at Netflix with a focus on datastores. Additionally, I've interned at places like Amazon and have experience in building web and mobile apps at a couple of startups. I graduated in December 2024, and outside of code, I spend my time climbing, training jiu-jitsu, watching anime, and hanging out with my dog Daisy.", ref_photos: ["/Climbing.jpg", "/Daisy.jpg"] },
    { id: 2, x: 3, y: 1, width: 1, height: 1, title: "LinkedIn", icon: "/LinkedIn.jpeg", content: "My LinkedIn", link: "https://www.linkedin.com/in/austin-wheeler-a84132248/" },
    { id: 7, x: 4, y: 1, width: 1, height: 1, title: "GitHub", icon: "/Github.jpeg", content: "My Github", link: "https://github.com/AustinWheel" },
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
          title: "RawHollow",
          description: [
            { type: 'text', content: "RawHollow is a low-latency, in-memory datastore for read-after-write workloads." },
          ],
          subprojects: [
            {
              title: "Fast Provisioning",
              description: [
                { type: 'text', content: "Context: Provisioning a Stateful Datastore" },
                { type: 'text', content: "RawHollow is a low-latency, in-memory datastore designed for read-after-write workloads. Provisioning a new datastore is not just a configuration change—it requires coordinating cloud infrastructure, dependent services, and control-plane state before the datastore can safely serve traffic." },
                { type: 'text', content: "At a high level, a provisioning request starts with user-defined requirements (such as namespace and capacity) and results in a fully initialized datastore instance that is ready to accept reads and writes." },
                { type: 'text', content: "Default Provisioning Pipeline" },
                { type: 'text', content: "In the default provisioning flow, infrastructure is created on demand. This includes allocating cloud resources, initializing dependent services, and performing safety checks before the datastore becomes available." },
                { type: 'text', content: "This approach prioritizes correctness and isolation, but provisioning latency is dominated by infrastructure creation time." },
                { type: 'image', src: '/fastprov-default.png', alt: 'Default provisioning pipeline: Request → Infrastructure allocation → Service initialization → Validation → Ready' },
                { type: 'text', content: "Under this model, end-to-end provisioning typically takes on the order of minutes, which is acceptable for infrequent setup but slows down iteration and onboarding for developers." },
                { type: 'text', content: "Improving Provisioning Latency with Fast Provisioning" },
                { type: 'text', content: "To reduce provisioning latency without compromising safety, I designed a fast provisioning path that decouples infrastructure creation from request time." },
                { type: 'text', content: "Instead of creating all infrastructure synchronously, fast provisioning maintains a pool of pre-allocated, pre-initialized resources that are kept in a ready state. When a new provisioning request arrives, these resources can be dynamically assigned and finalized for the requesting datastore." },
                { type: 'text', content: "This shifts the expensive work earlier, allowing request-time provisioning to focus on lightweight configuration and validation." },
                { type: 'image', src: '/fastprov-fast.png', alt: 'Fast provisioning pipeline with pre-allocated resource pool: Pre-provisioned pool → Request → Namespace assignment → Validation → Ready' },
                { type: 'text', content: "With this approach, provisioning latency is reduced from ~15 minutes to ~20 seconds, significantly improving developer productivity while preserving the same safety guarantees as the default path." },
              ]
            },
          ]
        },
        {
          title: "Wide Row Scanner",
          tag: "Internship",
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
    { id: 6, x: 3, y: 3, width: 2, height: 2, title: "Amazon", subtitle: "Internship", icon: "/amazon.jpg", content: "At Amazon, I helped simplify VPC data storage that was spread across roughly a thousand servers, each running its own copy of the same MySQL tables.\n I redesigned a key set of those tables for DynamoDB, creating cloud-native layouts that matched how our applications actually read and wrote data.\n After migrating the data and updating our billing APIs to use the new store, every server could pull from a single, highly available source instead of keeping its own replica.\n The change made the system noticeably snappier for customers, cut a large chunk of operational overhead, and paved the way for future teams to move the rest of their data with confidence." },
    { id: 8, x: 4, y: 2, width: 1, height: 1, title: "Austin's Blog", icon: "/blog.jpeg", content: "", appType: "blog" },
  ];

  // Calculate max row used by any app
  const maxRow = Math.max(...apps.map(app => app.y + app.height - 1));

  // Measure grid area and calculate how many rows fit
  useEffect(() => {
    const updateLayout = () => {
      if (!gridRef.current) return;
      const containerWidth = gridRef.current.clientWidth;
      const gridAreaHeight = gridRef.current.clientHeight;
      const cellWidth = containerWidth / 4;
      // Each row height ~1.2x cell width for iOS-like icon proportions
      const idealRowHeight = cellWidth * 1.2;
      const rows = Math.max(2, Math.floor(gridAreaHeight / idealRowHeight));
      setRowsPerPage(rows);
      // Cap grid height so icons maintain proper proportions
      setGridHeight(rows * idealRowHeight);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const totalPages = Math.ceil(maxRow / rowsPerPage);

  // Get apps that belong on a given page
  const getAppsForPage = (page: number) => {
    const startRow = page * rowsPerPage + 1;
    const endRow = (page + 1) * rowsPerPage;
    return apps.filter(app => {
      const appEndRow = app.y + app.height - 1;
      return app.y >= startRow && appEndRow <= endRow;
    });
  };

  // Ensure current page is valid when rowsPerPage changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0 && currentPage < totalPages - 1) {
        setCurrentPage(p => p + 1);
      } else if (distance < 0 && currentPage > 0) {
        setCurrentPage(p => p - 1);
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, currentPage, totalPages]);

  return (
    <div className="h-screen bg-black flex justify-center overflow-hidden" style={{ height: '100dvh' }}>
      <div className="flex-1 relative max-w-screen md:max-w-lg h-full bg-cover bg-center"
           style={{ backgroundImage: "url('/bg.JPG')" }}>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

        <div className="relative z-10 h-full flex flex-col px-4 pt-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-white text-lg font-medium">{formatTime(currentTime)}</h1>
            <p className="text-white/80 text-sm">{formatDate(currentTime)}</p>
          </motion.div>

          {/* Grid area - fills remaining space */}
          <div
            ref={gridRef}
            className="flex-1 relative overflow-hidden"
          >
            <div
              className="relative overflow-hidden mx-auto"
              style={gridHeight ? { height: gridHeight } : { height: '100%' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
            <motion.div
              className="flex h-full"
              animate={{ x: `-${currentPage * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full h-full flex-shrink-0 relative">
                  {getAppsForPage(pageIndex).map((app, index) => (
                    <GridIcon
                      key={app.id}
                      app={{ ...app, y: app.y - pageIndex * rowsPerPage }}
                      totalRows={rowsPerPage}
                      onClick={() => {
                        if (app.appType === 'blog') {
                          setBlogOpen(true);
                        } else {
                          setSelectedApp(app);
                        }
                      }}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
            </div>
          </div>

          {/* Page indicator dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 pt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'bg-white scale-110' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
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

      <AnimatePresence>
        {blogOpen && (
          <BlogApp onClose={() => setBlogOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
