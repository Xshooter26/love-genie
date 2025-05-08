import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LoveGenie - AI-Powered Conversation Assistant",
  description: "Get AI-powered suggestions for your conversations with your loved ones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-black`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
