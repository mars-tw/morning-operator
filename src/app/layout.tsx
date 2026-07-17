import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Operator",
  description: "A multilingual, approval-gated Shopify operations workflow."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
