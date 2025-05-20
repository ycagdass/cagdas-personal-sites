"use client";

import { cookieName, navLanguages } from "@/i18n/settings";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon } from "@hugeicons/core-free-icons";

export default function LanguageSwitcher() {
  const { i18n } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (newLng: string) => {
    document.cookie = `i18next=${newLng}; path=/`;
    const segments = pathname.split("/");
    segments[1] = newLng;
    const newPath = segments.join("/");
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    router.push(fullPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size="icon" className="relative">
          <HugeiconsIcon icon={Globe02Icon} className="h-[1.2rem] w-[1.2rem]" />
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
