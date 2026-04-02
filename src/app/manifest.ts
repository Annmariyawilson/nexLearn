import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NexLearn - Futuristic MCQ Exam Platform",
    short_name: "NexLearn",
    description: "Futuristic online MCQ exam application",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f3647",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      // You should add 192x192 and 512x512 icons for PWA/SEO
    ],
  };
}
