import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK MVP 1 - AI Unity Code Generator",
  description: "Generate Unity C# scripts from natural language prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
