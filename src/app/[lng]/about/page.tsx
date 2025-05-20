"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CoffeeIcon,
  GithubIcon,
  InstagramIcon,
  Linkedin02Icon,
  LinkSquareIcon,
  NewTwitterIcon,
  SourceCodeIcon,
  SpotifyIcon,
  TelegramIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

export default function HomePage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("about");

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    {
      icon: <HugeiconsIcon icon={GithubIcon} className="h-4 w-4" />,
      url: "https://github.com/mamiiblt",
    },
    {
      icon: <HugeiconsIcon icon={TelegramIcon} className="h-4 w-4" />,
      url: "https://t.me/mamiiblt",
    },
    {
      icon: <HugeiconsIcon icon={Linkedin02Icon} className="h-4 w-4" />,
      url: "https://www.linkedin.com/in/muhammed-ali-bulut-1a7b00364",
    },
    {
      icon: <HugeiconsIcon icon={InstagramIcon} className="h-4 w-4" />,
      url: "https://instagram.com/mamiiblt",
    },
    {
      icon: <HugeiconsIcon icon={SpotifyIcon} className="h-4 w-4" />,
      url: "https://open.spotify.com/user/qpg4rzp2n15covoviu0tkyj69?si=AkiQulRPRdO6ENBCAT7SHw",
    },
    {
      icon: <HugeiconsIcon icon={NewTwitterIcon} className="h-4 w-4" />,
      url: "https://x.com/mamiiblt",
    },
  ];

  const skills = [
    "Java",
    "C#",
    "JavaScript",
    "Compose",
    "React",
    t("interests.desktop"),
    "Android",
    "Web",
    t("interests.reverse"),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
  };

  const socialButtonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.6,
      },
    },
    tap: { scale: 0.9 },
  };

  if (!mounted) {
    return null;
  }

  return (
    <Suspense>
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center"
          variants={containerVariants}
        >
          <motion.div
            className={`relative mb-8 h-[180px] w-[180px] overflow-hidden rounded-full border-2 border-border ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            variants={profileVariants}
            whileHover="hover"
          >
            <Image
              src="/mamiiblt.png"
              alt={t("profile.photo")}
              width={180}
              height={180}
              className="h-full w-full object-cover"
              priority
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>

          <motion.h1
            className="mb-1 text-2xl font-bold tracking-tight"
            variants={itemVariants}
          >
            {t("profile.name")}
          </motion.h1>

          <motion.p
            className="mb-4 text-base font-light tracking-wide text-muted-foreground"
            variants={itemVariants}
          >
            {t("profile.title")}
          </motion.p>

          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-3"
            variants={containerVariants}
          >
            {socialLinks.map((link, index) => (
              <motion.div key={index} variants={itemVariants} custom={index}>
                <MotionButton
                  variant="outline"
                  size="icon"
                  asChild
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  variants={socialButtonVariants}
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </Link>
                </MotionButton>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mb-6 max-w-lg" variants={itemVariants}>
            <motion.p
              className="mb-4 text-base leading-relaxed text-foreground/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("about")}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid w-full max-w-md gap-4 md:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <MotionButton
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
                asChild
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  href="/projects"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={SourceCodeIcon} className="h-4 w-4" />
                  <span>{t("nav.projects")}</span>
                </Link>
              </MotionButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <MotionButton
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
                asChild
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  href="/blogs"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={LinkSquareIcon} className="h-4 w-4" />
                  <span>{t("nav.articles")}</span>
                </Link>
              </MotionButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <MotionButton
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
                asChild
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  href="https://t.me/mamiiblt"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={TelegramIcon} className="h-4 w-4" />

                  <span>{t("nav.contactme")}</span>
                </Link>
              </MotionButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <MotionButton
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
                asChild
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link
                  href="https://buymeacoffee.com/mamiiblt"
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={CoffeeIcon} className="h-4 w-4" />

                  <span>{t("nav.buymeacoffee")}</span>
                </Link>
              </MotionButton>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-2"
            variants={containerVariants}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-normal hover:bg-accent"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}
