"use client";

import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  thumbnail_url?: string;   // for VIDEO type
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  timestamp: string;
}

interface NewsCardsProps {
  enableAnimations?: boolean;
}

// Stroydom-branded placeholder posts shown when no Instagram token is configured
const PLACEHOLDER_POSTS: InstagramPost[] = [
  {
    id: "p1",
    permalink: "https://www.instagram.com/stroydom.uzbekistan/",
    media_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    media_type: "IMAGE",
    caption: "Yuqori sifatli Viega quvur tizimlari — ishonchli va uzoq xizmat qiluvchi muhandislik yechimlari. 🔧 #stroydom #viega #quvur",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p2",
    permalink: "https://www.instagram.com/stroydom.uzbekistan/",
    media_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop",
    media_type: "IMAGE",
    caption: "Chaffoteaux qozonlari — uyingizni iliq ushlab turadi. Energiya tejaydigan zamonaviy isitish tizimlari. 🏠🔥 #stroydom #chaffoteaux",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p3",
    permalink: "https://www.instagram.com/stroydom.uzbekistan/",
    media_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
    media_type: "IMAGE",
    caption: "BWT suv filtrlari — toza va sog'lom suv uchun professional yechim. 💧 #stroydom #bwt #suvfiltri #tozasuv",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  return `${Math.floor(diff / 86400)} kun oldin`;
}

function truncate(text: string, max = 80): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export function NewsCards({ enableAnimations = true }: NewsCardsProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/instagram/posts");
        if (!res.ok) throw new Error("No data");
        const data: InstagramPost[] = await res.json();
        setPosts(data.slice(0, 3));
      } catch {
        // Fallback to placeholder while Instagram token is not set up
        setPosts(PLACEHOLDER_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } },
  };

  const skeletonCards = Array.from({ length: 3 });

  return (
    <section id="instagram" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={shouldAnimate ? { opacity: 0, y: -16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Instagram
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-foreground mb-4">
            So'nggi yangiliklar
          </h2>
          <p className="text-muted-foreground text-lg">
            Stroydom Instagram sahifasidagi eng so'nggi postlar
          </p>
          {/* Decorative lines */}
          <div className="mt-6 space-y-1 flex flex-col items-center">
            {[1, 0.6, 0.3].map((op, i) => (
              <motion.div
                key={i}
                className="h-0.5 bg-foreground rounded-full"
                style={{ opacity: op, width: `${(3 - i) * 20}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 400, damping: 30 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {skeletonCards.map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-64 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={shouldAnimate ? containerVariants : {}}
            initial={shouldAnimate ? "hidden" : false}
            animate="visible"
          >
            {posts.map((post) => {
              const thumb = post.thumbnail_url || post.media_url;
              const isVideo = post.media_type === "VIDEO";

              return (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={shouldAnimate ? cardVariants : {}}
                  whileHover={shouldAnimate ? { y: -6, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } } : {}}
                  className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer flex flex-col hover:shadow-xl hover:border-pink-500/30 transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={thumb}
                      alt={post.caption ? truncate(post.caption, 60) : "Instagram post"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop";
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Video play icon */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Instagram logo + external link on hover */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 rounded-lg flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-all">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Bottom meta */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <span className="text-xs text-white/70">{timeAgo(post.timestamp)}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white/90 transition-colors" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3 group-hover:text-primary transition-colors">
                      {truncate(post.caption || "Instagram post", 120)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-pink-500 text-xs font-semibold">
                      <Instagram className="w-3.5 h-3.5" />
                      @stroydom.uzbekistan
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}

        {/* View all link */}
        <motion.div
          className="text-center mt-12"
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://www.instagram.com/stroydom.uzbekistan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-semibold hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-200"
          >
            <Instagram className="w-4 h-4" />
            Barcha postlarni ko'rish
          </a>
        </motion.div>
      </div>
    </section>
  );
}
