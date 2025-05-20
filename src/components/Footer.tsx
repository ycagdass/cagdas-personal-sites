"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Linkedin02Icon,
  TelegramIcon,
} from "@hugeicons/core-free-icons";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <Suspense fallback={null}>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative border-t border-border bg-background"
      >
        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {t("footer.copyright")}
              </p>
              <div className="flex items-center gap-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://github.com/mamiiblt"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                  target="_blank"
                >
                  <HugeiconsIcon icon={GithubIcon} className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://t.me/mamiiblt"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Telegram"
                  target="_blank"
                >
                  <HugeiconsIcon icon={TelegramIcon} className="h-5 w-5" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://www.linkedin.com/in/muhammed-ali-bulut-1a7b00364"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                  target="_blank"
                >
                  <HugeiconsIcon icon={Linkedin02Icon} className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </Suspense>
  );
}
