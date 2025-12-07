import type { Metadata } from "next";
import "./styles/spark.css";
import SparkLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "SPARK - Unity Script Generator",
  description: "Generate Unity C# scripts with AI",
};

export default function SparkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SparkLayoutClient>{children}</SparkLayoutClient>;
}
