/**
 * FAQ Component
 * Common questions and answers
 */

'use client';

import React, { useState } from "react";
import { ChevronRight } from "@/design-system/icons/ChevronRight";

export interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Lumenforge.io?",
    answer: "Lumenforge.io is a unified development environment that combines AI-powered code generation, design token management, blueprint editing, live previews, and deployment into a single platform. It's designed to streamline the entire creative pipeline for modern development teams."
  },
  {
    question: "How does it compare to Bolt.new or StackBlitz?",
    answer: "While Bolt.new and StackBlitz focus on browser-based coding, Lumenforge.io offers a complete creative pipeline including AI assistance, design token management, blueprint editing, and deployment. It's not just an IDE—it's an end-to-end development platform with game development features and Unity integration."
  },
  {
    question: "Do I need to install anything?",
    answer: "No! Lumenforge.io runs entirely in your browser. Just visit the site and start coding. No installation, no setup, no configuration required."
  },
  {
    question: "What technologies does it support?",
    answer: "We support JavaScript, TypeScript, React, Next.js, Vue, Node.js, and the full NPM ecosystem. For game development, we integrate with Unity and support C#. The platform uses WebContainer technology for browser-native execution."
  },
  {
    question: "Can I use it for free?",
    answer: "Yes! We offer a free tier with 5 projects, 50MB storage, and public repositories. Perfect for trying out the platform and personal projects. Upgrade to Pro for unlimited projects and advanced features."
  },
  {
    question: "Is my code secure and private?",
    answer: "Absolutely. We use end-to-end encryption, are SOC 2 compliant, and offer private repositories on all paid plans. Your code is never shared or used for training AI models. Enterprise plans include self-hosted options for maximum security."
  },
  {
    question: "Can I self-host Lumenforge.io?",
    answer: "Yes, self-hosting is available on Enterprise plans. This allows you to run Lumenforge.io on your own infrastructure with full control over data and security."
  },
  {
    question: "Do you offer support?",
    answer: "Yes! Free tier includes community support via our forums. Pro plans include priority email support, and Enterprise plans include dedicated support with SLA guarantees and custom training."
  },
  {
    question: "How does the AI code generation work?",
    answer: "Our AI analyzes your codebase context and generates code suggestions based on your project structure and patterns. It supports natural language to code conversion, intelligent autocomplete, and context-aware suggestions. The AI runs locally in your browser for privacy."
  },
  {
    question: "What deployment options are available?",
    answer: "You can deploy to all major platforms including Vercel, Netlify, AWS, and more with one-click deployment. Enterprise plans support custom deployment pipelines and on-premise deployments."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      style={{
        padding: "80px 32px",
        background: "var(--nv-bg-1)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{
            fontSize: "40px",
            fontWeight: 600,
            color: "var(--nv-text-0)",
            marginBottom: 16
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
          }}>
            Everything you need to know about Lumenforge.io
          </p>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: "var(--nv-bg-0)",
                border: "1px solid var(--nv-border)",
                borderRadius: "8px",
                overflow: "hidden"
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: "100%",
                  padding: "24px",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "var(--nv-text-0)"
                }}
              >
                <span style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--nv-text-0)", // Explicit white for better contrast
                  backgroundColor: "transparent" // Explicit background
                }}>
                  {faq.question}
                </span>
                <ChevronRight
                  size={20}
                  style={{
                    color: "var(--nv-text-1)", // Changed from --nv-text-2 for better contrast
                    backgroundColor: "transparent", // Explicit background
                    transform: openIndex === index ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    marginLeft: 16
                  }}
                />
              </button>
              
              {openIndex === index && (
                <div
                  style={{
                    padding: "0 24px 24px 24px",
                    color: "var(--nv-text-1)",
                    lineHeight: 1.6,
                    fontSize: "16px"
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
