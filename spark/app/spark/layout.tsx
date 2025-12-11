import type { Metadata } from "next";
import "./styles/spark.css";

export const metadata: Metadata = {
  title: "SPARK - Unity Script Generator",
  description: "Generate Unity C# scripts with AI",
};

export default function SparkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="spark-container">{children}</div>;
}
