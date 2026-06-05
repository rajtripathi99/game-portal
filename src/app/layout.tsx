import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GameHub — Play Free Online Games",
  description:
    "Play thousands of free online games instantly in your browser. Action, puzzle, racing, shooting and more — no downloads required.",
  keywords: "free games, online games, browser games, HTML5 games, play games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1 pt-16 md:pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
