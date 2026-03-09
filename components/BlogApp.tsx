"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GlassCloseButton } from "./Dialog";

const isDev = process.env.NODE_ENV === "development";

interface PostMeta {
  slug: string;
  title: string;
  date: string;
}

interface PostFull extends PostMeta {
  content: string;
}

interface BlogAppProps {
  onClose: () => void;
}

export default function BlogApp({ onClose }: BlogAppProps) {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostFull | null>(null);
  const [direction, setDirection] = useState(1);
  const [editing, setEditing] = useState(false);
  const [editorState, setEditorState] = useState({ slug: "", title: "", date: "", content: "" });
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openPost = async (slug: string) => {
    const res = await fetch(`/api/blog/${slug}`);
    const data = await res.json();
    setDirection(1);
    setSelectedPost(data);
  };

  const goBack = () => {
    setDirection(-1);
    setSelectedPost(null);
    setEditing(false);
  };

  const openEditor = (post?: PostFull) => {
    if (post) {
      setEditorState({ slug: post.slug, title: post.title, date: post.date, content: post.content.trim() });
    } else {
      setEditorState({ slug: "", title: "", date: new Date().toISOString().split("T")[0], content: "" });
    }
    setDirection(1);
    setEditing(true);
    setSelectedPost(null);
  };

  const savePost = async () => {
    const slug = editorState.slug || editorState.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editorState, slug }),
    });
    setEditing(false);
    setDirection(-1);
    await fetchPosts();
  };

  const deletePost = async (slug: string) => {
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setSelectedPost(null);
    setDirection(-1);
    await fetchPosts();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white"
      initial={{ scale: 0.8, opacity: 0, borderRadius: "40px" }}
      animate={{ scale: 1, opacity: 1, borderRadius: "0px" }}
      exit={{ scale: 0.8, opacity: 0, borderRadius: "40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-full flex flex-col max-w-lg mx-auto relative overflow-hidden">
        <AnimatePresence custom={direction}>
          {editing ? (
            /* Editor view (dev only) */
            <motion.div
              key="editor"
              className="flex-1 flex flex-col overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-5 pt-14 pb-4">
                <button
                  onClick={() => { setDirection(-1); setEditing(false); }}
                  className="flex items-center gap-1 text-blue-500 text-base font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={savePost}
                  disabled={!editorState.title.trim() || !editorState.content.trim()}
                  className="text-blue-500 text-base font-semibold disabled:text-gray-300"
                >
                  Save
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={editorState.title}
                  onChange={(e) => setEditorState((s) => ({ ...s, title: e.target.value }))}
                  className="w-full text-2xl font-bold text-black placeholder-gray-300 outline-none border-b border-gray-200 pb-2"
                />
                <input
                  type="date"
                  value={editorState.date}
                  onChange={(e) => setEditorState((s) => ({ ...s, date: e.target.value }))}
                  className="text-sm text-gray-500 outline-none"
                />
                <textarea
                  placeholder="Write your post in markdown..."
                  value={editorState.content}
                  onChange={(e) => setEditorState((s) => ({ ...s, content: e.target.value }))}
                  className="w-full flex-1 min-h-[300px] text-base text-gray-800 placeholder-gray-300 outline-none resize-none leading-relaxed font-mono"
                />
              </div>
            </motion.div>
          ) : !selectedPost ? (
            /* Post list */
            <motion.div
              key="list"
              className="flex-1 flex flex-col overflow-hidden"
              custom={direction}
              initial={{ x: direction < 0 ? "-30%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-30%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-5 pt-14 pb-4">
                <h1 className="text-3xl font-bold text-black">Austin&apos;s Blog</h1>
                <div className="flex items-center gap-3">
                  {isDev && (
                    <button
                      onClick={() => openEditor()}
                      className="text-blue-500 text-2xl font-light leading-none"
                      title="New post"
                    >
                      +
                    </button>
                  )}
                  <GlassCloseButton onClick={onClose} variant="dark" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5">
                {loading ? (
                  <p className="text-gray-400 text-center mt-12">Loading...</p>
                ) : posts.length === 0 ? (
                  <p className="text-gray-400 text-center mt-12">No posts yet.</p>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {posts.map((post) => (
                      <button
                        key={post.slug}
                        onClick={() => openPost(post.slug)}
                        className="w-full text-left py-4 group"
                      >
                        <p className="text-blue-500 text-base font-medium underline underline-offset-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">{formatDate(post.date)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Post view */
            <motion.div
              key="post"
              className="flex-1 flex flex-col overflow-hidden absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-5 pt-14 pb-4">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-blue-500 text-base font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                {isDev && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditor(selectedPost)}
                      className="text-blue-500 text-base font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(selectedPost.slug)}
                      className="text-red-500 text-base font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-8">
                <h1 className="text-2xl font-bold text-black mb-2">{selectedPost.title}</h1>
                <p className="text-gray-400 text-sm mb-6">{formatDate(selectedPost.date)}</p>
                <div className="blog-content text-gray-800 text-base leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedPost.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
