"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Post } from "@/lib/article";
import { ChevronLeft, ChevronRight, RefreshCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientArticleContentProps {
  title: string;
  description: string;
  posts: Post[];
}

const POSTS_PER_PAGE = 6;
const DEBOUNCE_DELAY = 300;
const REFRESH_COOLDOWN = 2000;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function ClientBlogContent({
  title,
  description,
  posts: initialPosts,
}: ClientArticleContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const { t } = useTranslation("articles");

  const fetchLatestPosts = async () => {
    if (!canRefresh || isRefreshing) return;

    try {
      setIsRefreshing(true);
      setIsLoading(true);
      setCanRefresh(false);

      const response = await fetch("/api/admin/posts");
      const data = await response.json();

      if (data.posts) {
        setPosts([]);
        setTimeout(() => {
          setPosts(data.posts);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to fetch latest posts:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
      setTimeout(() => setCanRefresh(true), REFRESH_COOLDOWN);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchLatestPosts, 30000);
    return () => clearInterval(intervalId);
  }, [fetchLatestPosts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.tags?.some((tag) =>
        tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center">
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-muted-foreground"
            >
              {description}
            </motion.p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex gap-4 w-full md:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchLatestPosts}
              className={`p-2.5 border rounded-lg shadow-sm hover:bg-secondary transition-all ${
                !canRefresh ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!canRefresh || isRefreshing}
            >
              <motion.div
                animate={{
                  rotate: isRefreshing ? 360 : 0,
                }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: isRefreshing ? Infinity : 0,
                }}
              >
                <RefreshCcw className="h-5 w-5" />
              </motion.div>
            </motion.button>
            <motion.div
              variants={itemVariants}
              className="w-full md:w-auto relative"
            >
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full md:w-72 pl-10 pr-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 transition-all bg-background dark:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex flex-nowrap md:flex-wrap gap-3 py-4">
            {allTags.map((tag, i) => (
              <motion.button
                key={tag}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="border-b border-accent my-8"
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 text-muted-foreground text-lg"
          >
            {t("loadingPosts")}
          </motion.div>
        ) : paginatedPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="text-center py-12 text-muted-foreground text-lg"
          >
            No blog posts found.
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid gap-8 md:gap-10"
          >
            {paginatedPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={itemVariants}
                custom={index}
              >
                <ArticleCard post={post} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex justify-center items-center gap-3 md:gap-5 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 md:p-2.5 rounded-lg hover:bg-secondary disabled:opacity-50 transition-all"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
          <motion.span
            variants={itemVariants}
            className="text-sm md:text-base font-medium"
          >
            Page {currentPage} of {totalPages}
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 md:p-2.5 rounded-lg hover:bg-secondary disabled:opacity-50 transition-all"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
