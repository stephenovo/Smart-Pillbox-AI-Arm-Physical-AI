import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smart-pillbox-ai-arm-physical-ai.stephenovo.workers.dev"),
  title: {
    default: "Smart Pillbox AI — Arm Physical AI",
    template: "%s · Smart Pillbox AI",
  },
  description:
    "A productized smart pillbox experience with private, offline medication-risk inference optimized for Arm64.",
  applicationName: "Smart Pillbox AI",
  icons: {
    icon: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
  openGraph: {
    title: "Smart Pillbox AI",
    description: "Arm Physical AI. Private by design.",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Smart Pillbox AI physical, intelligence, and action layers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Pillbox AI",
    description: "Arm Physical AI. Private by design.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
