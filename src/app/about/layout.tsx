import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `About`,
  description: "You can learn more about me here.",
};

export default function AboutLayout({
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
