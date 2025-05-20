"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavbarLoading } from "./loading";
import { NavigationItem } from "./NavigationItem";
import { Box } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import {
  CodeFolderIcon,
  CrazyIcon,
  GithubIcon,
  Menu03Icon,
  NewsIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(false);
  const { t, i18n } = useTranslation("common");
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading) {
    return <NavbarLoading />;
  }

  const navItems = [
    {
      title: t("navbar.items.articles"),
      href: `/articles`,
    },
    {
      title: t("navbar.items.projects"),
      href: "/projects",
    },
    {
      title: t("navbar.items.about"),
      href: "/about",
    },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
        >
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ rotate: -10 }}
          >
            <HugeiconsIcon icon={SourceCodeIcon} className="h-6 w-6" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-lg font-medium text-foreground"
          >
            mami.
          </motion.span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu className="relative">
            <NavigationMenuList className="flex gap-1 md:gap-2">
              <AnimatePresence>
                {navItems.map((link, index) => {
                  const isActive =
                    pathname ===
                    ("/" + i18n.language + link.href.split("?")[0] ||
                      "/" + i18n.language + link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NavigationItem
                        href={link.href}
                        title={link.title}
                        isActive={isActive}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <LanguageSwitcher />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <ThemeSwitcher />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="hidden md:block"
          >
            <Button
              asChild
              size="icon"
              variant="outline"
              className="transition-transform hover:scale-105"
            >
              <a
                href="https://github.com/mamiiblt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HugeiconsIcon icon={GithubIcon} className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative transition-all duration-200 hover:bg-accent hover:scale-105"
                  aria-label="Toggle menu"
                >
                  <HugeiconsIcon icon={Menu03Icon} className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 border-r-2">
                <div className="flex flex-col h-full">
                  <div className="border-b border-border p-5 bg-accent/10">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ rotate: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HugeiconsIcon
                          icon={SourceCodeIcon}
                          className="h-7 w-7"
                        />
                      </motion.div>
                      <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        mami.
                      </span>
                    </div>
                  </div>

                  <nav className="flex flex-col p-5 gap-2">
                    {navItems.map((link, index) => {
                      const isActive =
                        pathname ===
                        ("/" + i18n.language + link.href.split("?")[0] ||
                          "/" + i18n.language + link.href);
                      var MobileIcon = null;

                      if (link.title == t("navbar.items.articles")) {
                        MobileIcon = NewsIcon;
                      } else if (link.title == t("navbar.items.projects")) {
                        MobileIcon = CodeFolderIcon;
                      } else if (link.title == t("navbar.items.about")) {
                        MobileIcon = CrazyIcon;
                      } else {
                        MobileIcon = Box;
                      }

                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center space-x-4 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-primary/15 text-primary border-l-4 border-primary"
                                : "text-foreground hover:bg-accent/40 hover:text-accent-foreground hover:border-l-4 hover:border-primary/50"
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center w-9 h-9 rounded-full ${
                                isActive ? "bg-primary/20" : "bg-background/90"
                              } text-foreground group-hover:scale-110 transition-transform shadow-sm`}
                            >
                              <HugeiconsIcon
                                icon={MobileIcon}
                                className={`h-5 w-5 ${
                                  isActive ? "text-primary" : ""
                                }`}
                              />
                            </span>
                            <span className={isActive ? "font-semibold" : ""}>
                              {link.title}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-.5"
                              ></motion.div>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
