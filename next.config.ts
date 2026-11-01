import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite las fotos de ejemplo (.svg). Tus fotos reales pueden ser .jpg, .png o .webp.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
