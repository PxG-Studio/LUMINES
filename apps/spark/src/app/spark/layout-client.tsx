"use client";

import { useEffect } from "react";
import { initializeSpark } from "./init";

export default function SparkLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize SPARK services on mount
  useEffect(() => {
    initializeSpark();
  }, []);

  return <div className="spark-container">{children}</div>;
}

