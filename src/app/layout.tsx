import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NexLearn | Futuristic MCQ Exam Platform",
    template: "%s | NexLearn",
  },
  description: "NexLearn is a futuristic online exam application providing a seamless and interactive experience for MCQ-based testing.",
  keywords: ["NexLearn", "online exam", "MCQ platform", "futuristic learning", "student testing", "academic journey"],
  authors: [{ name: "NexLearn Team" }],
  creator: "NexLearn",
  publisher: "NexLearn",
  metadataBase: new URL("https://nexlearn.edu"), // Placeholder, update with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NexLearn | Futuristic MCQ Exam Platform",
    description: "Experience the next generation of online testing with NexLearn.",
    url: "https://nexlearn.edu",
    siteName: "NexLearn",
    images: [
      {
        url: "/og-image.png", // Ensure this exists in public folder or remove if not available
        width: 1200,
        height: 630,
        alt: "NexLearn Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexLearn | Futuristic MCQ Exam Platform",
    description: "Experience the next generation of online testing with NexLearn.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NexLearn",
              url: "https://nexlearn.edu",
              logo: "https://nexlearn.edu/assets/logo_white.png",
              sameAs: [
                "https://twitter.com/nexlearn",
                "https://facebook.com/nexlearn",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}