import type { NextConfig } from "next";
import os from "node:os";

/** LAN IPs so phones can load `/_next/*` when opening http://192.168.x.x:3000 */
function lanDevOrigins(): string[] {
  const origins = new Set<string>(["127.0.0.1", "localhost"]);
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets || []) {
      if (net.family !== "IPv4" || net.internal) continue;
      origins.add(net.address);
    }
  }
  for (const extra of (process.env.ALLOWED_DEV_ORIGINS || "").split(",")) {
    const host = extra.trim();
    if (host) origins.add(host);
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: lanDevOrigins(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
