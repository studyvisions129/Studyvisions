import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="hi" className={inter.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-[var(--sv-surface-dim)]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
