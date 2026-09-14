import type { NextConfig } from "next";

// Mirrors the original Cloudflare Pages `_redirects` rule:
//   / /SBSI_Master_Project_Portal.html 200
// (a rewrite, not a redirect — the URL stays "/" but serves the portal)
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/SBSI_Master_Project_Portal.html"
      }
    ];
  }
};

export default nextConfig;
