"use client";

import { cookieName, navLanguages } from "@/i18n/settings";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (newLng: string) => {
    i18n.changeLanguage(newLng, () => {
      document.cookie = `${cookieName}=${newLng}; path=/`;
    })
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size="icon" className="relative">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {navLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              i18n.resolvedLanguage === lang.code
                ? "bg-accent/40 font-medium"
                : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
            {i18n.resolvedLanguage === lang.code && (
              <span className="ml-auto text-primary">•</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}