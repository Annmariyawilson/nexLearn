import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a relative protocol for testing environments, or update with your real domain
  const baseUrl = "https://nexlearn-edu-test.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add other public static pages here (e.g., about, contact)
    // Exam/Result/OTP are private and shouldn't be in sitemap
  ];
}
