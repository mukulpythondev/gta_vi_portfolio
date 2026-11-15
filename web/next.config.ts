import type { NextConfig } from "next";

/** Painted art, project media and photos change rarely: cache for a day, revalidate in the background for a week. */
const mediaCache = "public, max-age=86400, stale-while-revalidate=604800";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Optimised variants are content-addressed by URL; keep them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    // The timeline now lives at the bottom of About as "Story mode".
    return [{ source: "/timeline", destination: "/about#story", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...["/art/:path*", "/projects/:path*", "/gallery/:path*", "/noise.png"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: mediaCache }],
      })),
    ];
  },
};

export default nextConfig;
