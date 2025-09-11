import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";


const lexend = Lexend(
  {
    subsets: ["latin"],
    display: "swap"
  }
)

export const metadata: Metadata = {
  title: "NanoLink",
  description: "Transform long, complex URLs into clean, shareable links in seconds. Fast, reliable, and beautifully simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
