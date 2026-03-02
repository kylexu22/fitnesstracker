import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kyle's Fitness Tracker",
    short_name: "FitnessTracker",
    description: "Personal workout tracker with templates and session logging.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2ea",
    theme_color: "#1f3a2d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
