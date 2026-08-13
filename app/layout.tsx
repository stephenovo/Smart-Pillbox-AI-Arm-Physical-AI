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
  metadataBase: new URL("https://careloop-edge-arm-ai.stephenovo.workers.dev"),
  title: {
    default: "CareLoop Edge — Arm Physical AI",
    template: "%s · CareLoop Edge",
  },
  description:
    "Private, offline medication-risk inference on Arm64 edge devices, connected to an ESP32-S3 sensor controller.",
  applicationName: "CareLoop Edge",
  openGraph: {
    title: "CareLoop Edge",
    description: "Physical AI. Private by design.",
    type: "website",
    images: [{ url: "/og.png", width: 1746, height: 910, alt: "CareLoop Edge physical AI architecture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareLoop Edge",
    description: "Physical AI. Private by design.",
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
