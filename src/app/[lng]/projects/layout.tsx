import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Projects`,
  description: "You can learn more about my projects here.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-primary-foreground dark:bg-primary-background">
        {children}
      </div>
    </div>
  );
}
