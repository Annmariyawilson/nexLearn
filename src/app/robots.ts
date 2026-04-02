import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Explicitly block private paths (with and without trailing slashes)
      disallow: ["/exam", "/verify-otp", "/result", "/profile"],
    },
    sitemap: "https://nexlearn.edu/sitemap.xml",
  };
}
