import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeHabit - Habit Tracker",
    short_name: "BeHabit",
    description: "Track your daily habits with a beautiful GitHub-inspired heatmap dashboard",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#18181b",
    theme_color: "#18181b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
