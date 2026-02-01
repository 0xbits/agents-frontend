import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "agents.b1ts.dev",
  description: "The registry for ERC-8004 Trustless Agents on Ethereum. Search capabilities, compare ratings, find the right agent.",
  keywords: ["AI agents", "ERC-8004", "trustless agents", "ethereum", "MCP", "A2A", "web3"],
  authors: [{ name: "Bits", url: "https://b1ts.dev" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "agents.b1ts.dev",
    description: "Discover AI Agents on Ethereum",
    url: "https://agents.b1ts.dev",
    siteName: "agents.b1ts.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "agents.b1ts.dev",
    description: "Discover AI Agents on Ethereum",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
