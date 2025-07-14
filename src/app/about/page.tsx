"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import GithubCalendar from "react-github-calendar";
import {
  GithubIcon,
  InstagramIcon,
  Linkedin02Icon,
  LinkSquareIcon,
  NewTwitterIcon,
  SourceCodeIcon,
  SpotifyIcon,
  TelegramIcon,
  CodeIcon,
  DatabaseIcon,
  StarIcon,
  FireIcon,
  MusicNote01Icon,
  PlayIcon,
  HeartCheckIcon,
  Analytics01Icon,
  UserMultipleIcon,
  UserGroupIcon,
  ComputerProgrammingIcon,
  CodeFolderIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

const MotionButton = motion(Button);
const MotionCard = motion(Card);

function useSpotifyCurrentTrack() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch("/api/spotify/current-track");

        if (response.ok) {
          const data = await response.json();
          if (data.is_playing && data.item) {
            setCurrentTrack({
              name: data.item.name,
              artist: data.item.artists[0].name,
              album: data.item.album.name,
              image: data.item.album.images[0]?.url,
              external_url: data.item.external_urls.spotify,
              preview_url: data.item.preview_url,
            });
            setIsPlaying(data.is_playing);
          } else {
            setCurrentTrack(null);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error("Spotify API error:", error);
        setCurrentTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrack();

    const interval = setInterval(fetchCurrentTrack, 30000);

    return () => clearInterval(interval);
  }, []);

  return { currentTrack, isPlaying, loading };
}

function SpotifyCard() {
  const { currentTrack, isPlaying, loading } = useSpotifyCurrentTrack();
  const { t } = useTranslation("about");

  if (loading) {
    return (
      <MotionCard
        className="p-6 text-left"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
          hover: { y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" },
        }}
        whileHover="hover"
      >
        <CardContent className="p-0">
          <div className="mb-3 flex items-start justify-between">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <HugeiconsIcon
                icon={SpotifyIcon}
                className="h-5 w-5 text-green-500"
              />
              Spotify
            </h4>
            <Badge variant="outline">{t("spotify.live")}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-muted"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-2"></div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </CardContent>
      </MotionCard>
    );
  }

  if (!currentTrack) {
    return (
      <MotionCard
        className="p-6 text-left"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
          hover: { y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" },
        }}
        whileHover="hover"
      >
        <CardContent className="p-0">
          <div className="mb-3 flex items-start justify-between">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={SpotifyIcon} className="h-5 w-5" />
              Spotify
            </h4>
            <Badge variant="outline">{t("spotify.offline")}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
              <HugeiconsIcon
                icon={MusicNote01Icon}
                className="h-6 w-6 text-muted-foreground"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {t("spotify.currentlyno")}
              </p>
            </div>
          </div>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      className="p-6 text-left"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" },
      }}
      whileHover="hover"
    >
      <CardContent className="p-0">
        <div className="mb-3 flex items-start justify-between">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={SpotifyIcon} className="h-5 w-5" />
            Spotify
          </h4>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {isPlaying ? (
              <>
                {isPlaying && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                  >
                    <HugeiconsIcon icon={PlayIcon} className="h-3 w-3 mr-1" />
                  </motion.div>
                )}
                {t("spotify.playing")}
              </>
            ) : (
              t("spotify.paused")
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
            {currentTrack.image ? (
              <Image
                src={currentTrack.image || "/placeholder.svg"}
                alt={currentTrack.album}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <HugeiconsIcon
                  icon={MusicNote01Icon}
                  className="h-6 w-6 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-sm truncate mb-1">
              {currentTrack.name}
            </h5>
            <p className="text-xs text-muted-foreground truncate mb-1">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={currentTrack.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full items-center gap-1"
            >
              <HugeiconsIcon icon={SpotifyIcon} className="h-3 w-3 " />
              {t("spotify.open")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </MotionCard>
  );
}

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
    {
      name: "Java & Kotlin",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "Native Android",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "React",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "React Native",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "Flutter",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "Compose",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "ExpressJS",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "ElectronJS",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "Node.js",
      icon: <HugeiconsIcon icon={CodeIcon} className="h-3 w-3" />,
    },
    {
      name: "Firebase",
      icon: <HugeiconsIcon icon={DatabaseIcon} className="h-3 w-3" />,
    },
    {
      name: "Postgres",
      icon: <HugeiconsIcon icon={DatabaseIcon} className="h-3 w-3" />,
    },
  ];

  const stats = [
    {
      label: t("stats.stars"),
      value: "350+",
      icon: <HugeiconsIcon icon={StarIcon} className="h-4 w-4" />,
    },
    {
      label: t("stats.cont"),
      value: "2.5k",
      icon: <HugeiconsIcon icon={FireIcon} className="h-4 w-4" />,
    },
    {
      label: t("stats.repo"),
      value: "10+",
      icon: <HugeiconsIcon icon={CodeFolderIcon} className="h-4 w-4" />,
    },
    {
      label: t("stats.com"),
      value: t("stats.act", { count: 2 }),
      icon: <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" />,
    },
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    hover: {
      y: -5,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
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
          className="container mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-4 text-center"
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
            className="mb-4 flex flex-wrap justify-center gap-3"
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

          <motion.div className="mb-8 max-w-lg" variants={itemVariants}>
            <motion.p
              className="text-base leading-relaxed text-foreground/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {t("about")}
            </motion.p>
          </motion.div>

          <motion.div className="mb-4 w-full max-w-2xl" variants={itemVariants}>
            <SpotifyCard />
          </motion.div>

          <motion.div className="mb-4 w-full max-w-2xl" variants={itemVariants}>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <HugeiconsIcon icon={Analytics01Icon} className="h-5 w-5" />
                    {t("stats.stats")}
                  </h4>
                </div>
                <motion.div
                  className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
                  variants={containerVariants}
                >
                  {stats.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <MotionCard
                        className="p-4 text-center"
                        variants={cardVariants}
                        whileHover="hover"
                      >
                        <CardContent className="p-0">
                          <div className="mb-2 flex justify-center text-primary">
                            {stat.icon}
                          </div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </CardContent>
                      </MotionCard>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="mb-4 w-full max-w-2xl" variants={itemVariants}>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <HugeiconsIcon
                      icon={ComputerProgrammingIcon}
                      className="h-5 w-5"
                    />
                    {t("tool-tech")}
                  </h4>
                </div>
                <motion.div
                  className="w-full max-w-2xl"
                  variants={itemVariants}
                >
                  <div className="flex flex-wrap justify-center gap-2">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {skill.icon}
                          <span>{skill.name}</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="mb-4 w-full max-w-2xl" variants={itemVariants}>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <HugeiconsIcon icon={FireIcon} className="h-5 w-5" />
                    {t("stats.contgraph")}
                  </h4>
                </div>
                <GithubCalendar username="mamiiblt" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="mb-4 grid w-full max-w-md gap-4 md:grid-cols-2"
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
                  href="/articles"
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
                  href="https://github.com/sponsors/mamiiblt"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={HeartCheckIcon} className="h-4 w-4" />
                  <span>{t("nav.support")}</span>
                </Link>
              </MotionButton>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <MotionButton
                variant="default"
                className="w-full"
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
          </motion.div>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}
