"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/article";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  post: Post;
  index: number;
}

export function ArticleCard({ post, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Link
        href={`/article/${post.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 overflow-hidden rounded-xl border bg-card transition-all hover:shadow-xl"
      >
        <div className="relative aspect-[16/9] lg:aspect-[4/3] overflow-hidden w-full h-full">
          <Image
            src={post.image || "/example-blog.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 350px"
            quality={90}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="p-5 lg:p-8 space-y-5 lg:space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <time dateTime={post.date} className="font-medium">
                {formatDate(post.date)}
              </time>
              <span className="bg-secondary/30 px-3 py-1 rounded-full">
                {post.readingTime}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h2>

            <p className="text-muted-foreground text-lg line-clamp-2">
              {post.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-1.5 text-sm font-medium bg-secondary/50 rounded-full text-secondary-foreground hover:bg-secondary/70 transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          <div className="pt-4">
            <span className="text-base font-medium text-primary inline-flex items-center group-hover:translate-x-3 transition-transform duration-300 ease-out">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
