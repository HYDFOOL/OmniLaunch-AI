import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SubscriptionProvider } from "@/lib/subscription-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "OmniLaunch AI — Autonomous E-Commerce Automation",
  description:
    "AI-powered product discovery, store connection, and autonomous ad validation for modern e-commerce brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <SubscriptionProvider>{children}</SubscriptionProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
