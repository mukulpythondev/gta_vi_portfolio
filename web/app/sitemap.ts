import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/map",
    "/about",
    "/missions",
    "/experience",
    "/hackathons",
    "/skills",
    "/achievements",
    "/gallery",
    "/contact",
    "/resume",
    ...projects.map((item) => `/missions/${item.slug}`),
    ...experience.map((item) => `/experience/${item.slug}`),
  ];
  return routes.map((route) => ({
    url: new URL(route, siteUrl).href,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
