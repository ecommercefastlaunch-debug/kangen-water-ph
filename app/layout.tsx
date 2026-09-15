import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const title = "LeveLuk K8 — Water, elevated";
const description =
  "Discover Enagic's LeveLuk K8: five types of water across seven pH settings, an eight-plate electrolysis cell and a touch display. Request a presentation in the Philippines.";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${title} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE_NAME,
    title,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#faf9f6",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PH" className={interTight.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
