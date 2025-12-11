/**
 * MDX Compiler
 * Compiles raw MDX source → React component
 */

import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import * as React from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";

export async function compileMDX(source: string): Promise<any> {
  try {
    const compiled = await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight]
    });

    // Turn compiled code into executable function
    const fn = new Function(
      "React",
      "jsx",
      "jsxs",
      "Fragment",
      String(compiled)
    );

    return fn(
      React,
      jsx,
      jsxs,
      Fragment
    );
  } catch (err: any) {
    throw new Error(`MDX compilation error: ${err.message}`);
  }
}

