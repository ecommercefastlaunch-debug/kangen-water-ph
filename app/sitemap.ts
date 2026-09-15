import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  return [
    { url: new URL("/", base).toString(), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/privacy", base).toString(), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
