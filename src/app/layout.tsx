import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { EggsProvider } from "@/components/Eggs";
import { analytics } from "@/content/analytics";
import { profile } from "@/content/profile";
import "./globals.css";

const sans = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.name} · Senior Frontend Engineer`,
  description: profile.pitch,
  openGraph: {
    title: `${profile.name} · Senior Frontend Engineer`,
    description: profile.pitch,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <EggsProvider>{children}</EggsProvider>
        {analytics.websiteId && (
          <Script src={analytics.scriptUrl} data-website-id={analytics.websiteId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
