import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "StudyVisions - Learn Better. Build Your Future.",
  description:
    "StudyVisions is a Digital Learning Commerce Platform providing high-quality educational digital products for students in India.",
  keywords: [
    "StudyVisions",
    "CBSE notes",
    "study material",
    "eBooks",
    "Indian students",
    "digital learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable)}>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
