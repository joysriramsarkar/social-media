import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "সোশ্যালমিডিয়া - বাংলা সোশ্যাল মিডিয়া প্ল্যাটফর্ম",
  description: "বাংলা ভাষার সোশ্যাল মিডিয়া প্ল্যাটফর্ম যেখানে আপনি বন্ধুদের সাথে সংযুক্ত থাকতে পারেন",
  keywords: ["সোশ্যালমিডিয়া", "বাংলা", "সোশ্যাল নেটওয়ার্ক", "বন্ধুত্ব", "বাংলাদেশ"],
  authors: [{ name: "সোশ্যালমিডিয়া টিম" }],
  openGraph: {
    title: "সোশ্যালমিডিয়া",
    description: "বাংলা ভাষার সোশ্যাল মিডিয়া প্ল্যাটফর্ম",
    url: "https://socialmedia.example.com",
    siteName: "সোশ্যালমিডিয়া",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "সোশ্যালমিডিয়া",
    description: "বাংলা ভাষার সোশ্যাল মিডিয়া প্ল্যাটফর্ম",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
