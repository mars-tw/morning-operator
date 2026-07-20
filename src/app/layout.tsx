import type { Metadata } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getPublicSiteUrl(),
  title: {
    default: "Morning Operator",
    template: "%s | Morning Operator"
  },
  description: "A multilingual, approval-gated automation service factory with a fixed-scope SEO foundation service.",
  applicationName: "Morning Operator",
  openGraph: {
    type: "website",
    siteName: "Morning Operator",
    title: "Morning Operator",
    description: "Measure repeatable work, build useful websites, and improve search foundations with human approval."
  },
  twitter: {
    card: "summary",
    title: "Morning Operator",
    description: "Open-source, multilingual automation and SEO foundations with explicit human gates."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
