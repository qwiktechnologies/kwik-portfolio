import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qwik Technologies",
    short_name: "Qwik",
    description: "Reliable digital services. Templates and experiences, priced in naira and shown in your currency.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe6",
    theme_color: "#f3efe6",
  };
}
