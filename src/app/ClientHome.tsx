"use client";

import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/articles/ArticleCard";

export default function ClientHome({ posts }) {
  const { t } = useTranslation("home");

  const heroButtons = [
    {
      text: t("heroButtons.viewProjects"),
      href: "/projects",
      variant: "gradient",
      size: "lg",
    },
    {
      text: t("heroButtons.aboutMe"),
      href: "/about",
      variant: "gradient-secondary",
      size: "lg",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="space-y-8 sm:space-y-12 py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="animate-fadeIn">
            <section className="container relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 md:px-8 lg:px-12 py-12 md:py-24 lg:py-36">
              <div className="mx-auto max-w-5xl flex flex-col items-center text-center space-y-8 md:space-y-10 lg:space-y-12">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors duration-300">
                    {t("hero.1")}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors duration-300">
                    {t("hero.2")}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] leading-relaxed"
                >
                  {t("desc")}
                </motion.p>

                <AnimatePresence>
                  {heroButtons && heroButtons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-6 md:mt-8 lg:mt-10 w-full sm:w-auto"
                    >
                      {heroButtons.map((button, index) => (
                        <Button
                          key={index}
                          asChild
                          size={(button.size as any) || "lg"}
                          variant={(button.variant as any) || "default"}
                          className="w-full sm:w-auto transform hover:scale-105 transition-transform duration-200"
                        >
                          <Link href={button.href}>{button.text}</Link>
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
          <div className="animate-slideUp">
            <section className="container px-4 sm:px-8 lg:px-12 py-16 overflow-hidden">
              <div className="mx-auto max-w-6xl space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <motion.h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("recentPosts")}
                  </motion.h2>
                  <Button
                    asChild
                    variant="link"
                    size="lg"
                    className="text-lg hover:translate-x-1 transition-transform"
                  >
                    <Link href="/articles">{t("viewAllPosts")}</Link>
                  </Button>
                </motion.div>

                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      staggerChildren: 0.1,
                    }}
                    className="grid grid-cols-1 gap-8 sm:gap-12 max-w-6xl mx-auto"
                  >
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="h-full"
                      >
                        <ArticleCard post={post} index={index} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
