"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChevronRight } from "lucide-react";

interface TOCProps {
  headings: Array<{ id: string; text: string; level: number }>;
}

export function TableOfContents({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isAtBottom = useCallback(() => {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    );
  }, []);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (isAtBottom()) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      const visibleEntries = entries.filter((entry) => {
        return entry.isIntersecting && entry.boundingClientRect.top > 0;
      });

      if (visibleEntries.length === 0) return;

      const sortedEntries = visibleEntries.sort((a, b) => {
        const aTop = a.boundingClientRect.top;
        const bTop = b.boundingClientRect.top;

        if (Math.abs(aTop - bTop) < 50) {
          return aTop - bTop;
        }

        const aDistance = Math.abs(aTop - 150);
        const bDistance = Math.abs(bTop - 150);
        return aDistance - bDistance;
      });

      setActiveId(sortedEntries[0].target.id);
    },
    [headings, isAtBottom]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-100px 0px -70% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      if (isAtBottom()) {
        setActiveId(headings[headings.length - 1].id);
      }

      if (isMobile) {
        setIsVisible(false);
        const timeout = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timeout);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings, handleIntersection, isAtBottom, isMobile]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 150;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    const checkScroll = () => {
      if (Math.abs(window.scrollY - offsetPosition) < 5) {
        setActiveId(id);
        history.pushState(null, "", `#${id}`);
      } else {
        requestAnimationFrame(checkScroll);
      }
    };

    requestAnimationFrame(checkScroll);
  };

  if (headings.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto px-4 md:px-6 backdrop-blur-sm bg-background/80"
        >
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Table of Contents
          </h2>
          <nav className="space-y-1.5">
            {headings.map((heading) => (
              <motion.button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center w-full text-left px-3 py-2 rounded-lg
                  hover:bg-secondary/60 transition-all duration-200 ease-in-out
                  ${
                    activeId === heading.id
                      ? "bg-secondary/80 text-primary font-medium shadow-sm"
                      : "text-muted-foreground"
                  }
                  ${
                    heading.level === 1
                      ? "ml-0"
                      : heading.level === 2
                      ? "ml-4"
                      : heading.level === 3
                      ? "ml-8"
                      : "ml-12"
                  }
                `}
              >
                <motion.div
                  animate={{ rotate: activeId === heading.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                </motion.div>
                <span className="text-sm truncate">{heading.text}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
