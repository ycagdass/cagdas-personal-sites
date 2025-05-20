"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ExternalLink, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const MotionButton = motion(Button);

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  github?: string;
  website?: string;
  telegram?: string;
  featured: boolean;
}

export default function ProjecstPage() {
  return (
    <Suspense>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("projects");

  const projects: Project[] = [
    {
      id: "instafel",
      title: "Instafel",
      description: t("p_descriptions.instafel"),
      image: "/pbanners/instafel.png",
      category: t("categories.android-app"),
      technologies: ["Java", "Smali", "React"],
      github: "https://github.com/mamiiblt/instafel",
      website: "https://instafel.mamiiblt.me",
      telegram: "https://t.me/instafel",
      featured: true,
    },
    {
      id: "instafel-updater",
      title: "Instafel Updater",
      description: t("p_descriptions.instafel-updater"),
      image: "/pbanners/instafel-updater.png",
      category: t("categories.android-app"),
      technologies: ["Java"],
      github: "https://github.com/mamiiblt/instafel-updater",
      website: "https://instafel.mamiiblt.me/about_updater",
      featured: false,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t("desc")}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover="hover"
              className="group"
            >
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.featured && (
                    <div className="absolute right-3 top-3 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                      {t("featured")}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <Badge
                      variant="outline"
                      className="bg-accent/30 text-xs font-medium"
                    >
                      {project.category}
                    </Badge>
                  </div>

                  <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.github && (
                      <MotionButton
                        variant="outline"
                        size="sm"
                        asChild
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </Link>
                      </MotionButton>
                    )}

                    {project.website && (
                      <MotionButton
                        variant="outline"
                        size="sm"
                        asChild
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Link
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{t("website")}</span>
                        </Link>
                      </MotionButton>
                    )}

                    {project.telegram && (
                      <MotionButton
                        variant="outline"
                        size="sm"
                        asChild
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Link
                          href={project.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>Telegram</span>
                        </Link>
                      </MotionButton>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
