import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nom,
    short_name: site.nom,
    description: site.baseline,
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7f00fb",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
