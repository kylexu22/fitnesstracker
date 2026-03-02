import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";

import { PWARegister } from "@/components/pwa-register";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "Personal fitness tracker with templates and workout logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
        <PWARegister />
        <div className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-6">
          <header className="mb-5">
            <SiteNav />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
