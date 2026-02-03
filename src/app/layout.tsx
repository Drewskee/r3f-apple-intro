import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Apple Intro - r3f";
const APP_DEFAULT_TITLE = "Apple Intro - r3f";
const APP_TITLE_TEMPLATE = "%s - Apple Intro - r3f";
const APP_DESCRIPTION = "A React Three Fiber recreation of the Apple WWDC 2025 intro animation.";

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  };
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
    authors: [{
    name: "Drew Stephenson",
    url: "https://drewstephenson.io",
    }],

  description: APP_DESCRIPTION,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
