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
    { id: 1, x: 1, y: 1, width: 2, height: 2, title: "About Me", icon: "/bush.jpg", content: "Hi, I’m Austin Wheeler — currently a software engineer at Netflix with a focus on datastores. Additionally, I've interned at places like Amazon and have experience in building web and mobile apps at a handful of scrappy startups. I graduated in December 2024, and outside of code, I spend my time climbing, training jiu-jitsu, watching anime, and hanging out with my dog Daisy." },
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
            {
              title: "Soft Delete & Cleanup",
              description: [
                { type: 'text', content: "Built recoverable, programmatic deletion for RawHollow and dependent resources, including soft-delete with up to 90-day restore, as well as automated cleanup of stale test datastores saving ~$400k in unused cloud resources." },
              ]
            },
            {
              title: "Multi-Region Support",
              description: [
                { type: 'text', content: "Expanded service availability from a single region to full multi-region support, enabling wider global usage." },
              ]
            },
            {
              title: "Lifecycle Testing",
              description: [
                { type: 'text', content: "Designed and implemented automated end-to-end lifecycle testing that provisions new RawHollow datastores, validates service functionality, and safely tears them down, covering both standard and fast-provisioning paths." },
              ]
            },
            {
              title: "Shadow Replay Testing",
              description: [
                { type: 'text', content: "Built shadow replay (canary) testing for RawHollow by cloning live customer datasets and replaying production traffic against new releases, enabling regression detection for non-idempotent workloads." },
              ]
            },
          ]
        },
        {
          title: "Cinder",
          description: [
            { type: 'text', content: "Cinder is a high-density, versioned, persistent near-cache with a producer-consumer pattern." },
          ],
          subprojects: [
            {
              title: "Region-Staggered Publishes",
              description: [
                { type: 'text', content: "Implemented region-staggered publishes, enabling controlled rollouts across all US regions with the ability to halt consumption for rapid failure isolation." },
              ]
            },
            {
              title: "Observability & Debugging",
              description: [
                { type: 'text', content: "Improved operational observability and debugging with cycle version introspection, historical querying, and graph-based visualization of dataset lineage, making forked or broken update chains easier to detect." },
              ]
            },
          ]
        },
        {
          title: "Gutenberg",
          description: [
            { type: 'text', content: "Gutenberg is a versioned publish-subscribe datastore." },
          ],
          subprojects: [
            {
              title: "Purger Job Scaling",
              description: [
                { type: 'text', content: "Scaled the purger job by 10× with a multithreaded, concurrent design to increase throughput, reducing purging time from ~40 hours to ~4 hours and preventing backlog growth across tens of thousands of topics." },
              ]
            },
          ]
        },
        {
          title: "Control Plane Reliability",
          description: [
            { type: 'text', content: "Hardened control-plane operations by adding full metrics coverage, defining SLOs, configuring alerting, and delivering dashboards for provisioning, reads/writes, deletions, and latency monitoring." },
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