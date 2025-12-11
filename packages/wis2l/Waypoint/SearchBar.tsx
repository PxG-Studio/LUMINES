/**
 * SearchBar Component
 * Search input for filtering documentation
 */

'use client';

import React, { useEffect, useState } from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { searchDocs } from "./search/searchIndex";
import { useWaypointState } from "./waypointState";

export interface SearchBarProps {
  query: string;
  setQuery: (v: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchBar({
  query,
  setQuery,
  placeholder = "Search documentation…",
  className,
  style
}: SearchBarProps) {
  const theme = useTheme();
  const setCurrentDoc = useWaypointState((s) => s.setCurrentDoc);
  const [results, setResults] = useState<Array<{ id: string }>>([]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchDocs(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (docId: string) => {
    setCurrentDoc(docId);
    setQuery("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={className}
        style={{
          width: "100%",
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          background: theme.colors.bg2,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radii.sm,
          color: theme.colors.text1,
          fontSize: theme.typography.size.sm,
          fontFamily: theme.typography.font,
          marginBottom: theme.spacing.md,
          outline: "none",
          transition: "border-color 0.15s ease",
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.accent;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.colors.border;
        }}
      />
      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: theme.colors.bg1,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            marginTop: theme.spacing.xs,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: theme.shadows.strong
          }}
        >
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result.id)}
              style={{
                padding: theme.spacing.sm,
                cursor: "pointer",
                fontSize: theme.typography.size.sm,
                color: theme.colors.text1,
                borderBottom: `1px solid ${theme.colors.border}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.bg2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {result.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

