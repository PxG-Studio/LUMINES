/**
 * Search & Replace Component
 * 
 * Find and replace functionality for Monaco Editor
 * Supports regex, case sensitivity, whole word matching
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronUp, ChevronDown, Regex, CaseSensitive, WholeWord, Replace } from 'lucide-react';
import type { editor } from 'monaco-editor';

export interface SearchReplaceProps {
  editor: editor.IStandaloneCodeEditor | null;
  visible?: boolean;
  onClose?: () => void;
}

export const SearchReplace: React.FC<SearchReplaceProps> = ({
  editor,
  visible = false,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isWholeWord, setIsWholeWord] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when visible
  useEffect(() => {
    if (visible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [visible]);

  // Perform search
  const performSearch = () => {
    if (!editor || !searchTerm) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const model = editor.getModel();
    if (!model) return;

    const searchOptions: editor.ISearchOptions = {
      regex: isRegex,
      matchCase: isCaseSensitive,
      wholeWord: isWholeWord,
    };

    const matches = model.findMatches(searchTerm, false, true, isRegex, isCaseSensitive, isWholeWord);
    setMatchCount(matches.length);
    setCurrentMatch(matches.length > 0 ? 1 : 0);

    // Navigate to first match and highlight
    if (matches.length > 0) {
      const firstMatch = matches[0];
      editor.setPosition(firstMatch.range.getStartPosition());
      editor.setSelection(firstMatch.range);
      editor.revealLineInCenter(firstMatch.range.startLineNumber);
      
      // Add decorations for all matches
      editor.deltaDecorations(
        [],
        matches.map((match) => ({
          range: match.range,
          options: {
            className: 'search-match',
            inlineClassName: 'search-match',
          },
        }))
      );
    }
  };

  // Navigate to next match
  const goToNext = () => {
    if (!editor || !searchTerm) return;

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(searchTerm, false, true, isRegex, isCaseSensitive, isWholeWord);
    if (matches.length === 0) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const nextIndex = currentMatch < matches.length ? currentMatch : 0;
    const match = matches[nextIndex];

    editor.setPosition(match.range.getStartPosition());
    editor.setSelection(match.range);
    editor.revealLineInCenter(match.range.startLineNumber);

    setCurrentMatch(nextIndex + 1);
    setMatchCount(matches.length);
  };

  // Navigate to previous match
  const goToPrevious = () => {
    if (!editor || !searchTerm) return;

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(searchTerm, false, true, isRegex, isCaseSensitive, isWholeWord);
    if (matches.length === 0) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const prevIndex = currentMatch > 1 ? currentMatch - 2 : matches.length - 1;
    const match = matches[prevIndex];

    editor.setPosition(match.range.getStartPosition());
    editor.setSelection(match.range);
    editor.revealLineInCenter(match.range.startLineNumber);

    setCurrentMatch(prevIndex + 1);
    setMatchCount(matches.length);
  };

  // Replace current match
  const replace = () => {
    if (!editor || !searchTerm || !replaceTerm) return;

    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const selectedText = model.getValueInRange(selection);
    
    // Check if selected text matches search term
    let shouldReplace = false;
    if (isRegex) {
      const regex = new RegExp(searchTerm, isCaseSensitive ? 'g' : 'gi');
      shouldReplace = regex.test(selectedText);
    } else {
      if (isCaseSensitive) {
        shouldReplace = selectedText === searchTerm;
      } else {
        shouldReplace = selectedText.toLowerCase() === searchTerm.toLowerCase();
      }
    }

    if (shouldReplace) {
      editor.executeEdits('replace', [
        {
          range: selection,
          text: replaceTerm,
        },
      ]);
      goToNext();
    }
  };

  // Replace all matches
  const replaceAll = () => {
    if (!editor || !searchTerm || !replaceTerm) return;

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(searchTerm, false, true, isRegex, isCaseSensitive, isWholeWord);
    if (matches.length === 0) return;

    // Sort matches by position (reverse order to maintain positions)
    const sortedMatches = [...matches].sort((a, b) => {
      if (a.range.startLineNumber !== b.range.startLineNumber) {
        return b.range.startLineNumber - a.range.startLineNumber;
      }
      return b.range.startColumn - a.range.startColumn;
    });

    // Replace all matches
    editor.executeEdits('replaceAll', sortedMatches.map((match) => ({
      range: match.range,
      text: replaceTerm,
    })));

    setMatchCount(0);
    setCurrentMatch(0);
  };

  // Update search when options change
  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [isRegex, isCaseSensitive, isWholeWord]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderTop: 'none',
        borderRight: 'none',
        borderRadius: '0 0 0 8px',
        padding: '8px 12px',
        zIndex: 1000,
        minWidth: 400,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Search Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setTimeout(performSearch, 100);
            }}
            style={{
              width: '100%',
              padding: '6px 8px 6px 32px',
              background: 'var(--slate-bg, #0f1115)',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                goToPrevious();
              } else if (e.key === 'Enter') {
                e.preventDefault();
                goToNext();
              }
            }}
          />
        </div>

        {/* Match Count */}
        {searchTerm && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
              whiteSpace: 'nowrap',
              minWidth: 60,
              textAlign: 'right',
            }}
          >
            {currentMatch > 0 ? `${currentMatch} / ${matchCount}` : '0 / 0'}
          </div>
        )}

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          disabled={matchCount === 0}
          style={{
            padding: '4px 6px',
            background: 'transparent',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: 'var(--slate-text, #e4e7eb)',
            cursor: matchCount > 0 ? 'pointer' : 'not-allowed',
            opacity: matchCount > 0 ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Previous (Shift+Enter)"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={goToNext}
          disabled={matchCount === 0}
          style={{
            padding: '4px 6px',
            background: 'transparent',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: 'var(--slate-text, #e4e7eb)',
            cursor: matchCount > 0 ? 'pointer' : 'not-allowed',
            opacity: matchCount > 0 ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Next (Enter)"
        >
          <ChevronDown size={14} />
        </button>

        {/* Options */}
        <button
          onClick={() => setIsRegex(!isRegex)}
          style={{
            padding: '4px 6px',
            background: isRegex ? 'rgba(166, 77, 255, 0.2)' : 'transparent',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: isRegex ? '#A64DFF' : 'var(--slate-text, #e4e7eb)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Regex"
        >
          <Regex size={14} />
        </button>
        <button
          onClick={() => setIsCaseSensitive(!isCaseSensitive)}
          style={{
            padding: '4px 6px',
            background: isCaseSensitive ? 'rgba(166, 77, 255, 0.2)' : 'transparent',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: isCaseSensitive ? '#A64DFF' : 'var(--slate-text, #e4e7eb)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Case Sensitive"
        >
          <CaseSensitive size={14} />
        </button>
        <button
          onClick={() => setIsWholeWord(!isWholeWord)}
          style={{
            padding: '4px 6px',
            background: isWholeWord ? 'rgba(166, 77, 255, 0.2)' : 'transparent',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: isWholeWord ? '#A64DFF' : 'var(--slate-text, #e4e7eb)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Whole Word"
        >
          <WholeWord size={14} />
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            padding: '4px 6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-text-muted, #9ba1aa)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Close (Esc)"
        >
          <X size={14} />
        </button>
      </div>

      {/* Replace Row */}
      {isReplaceMode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Replace
              size={16}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--slate-text-muted, #9ba1aa)',
              }}
            />
            <input
              ref={replaceInputRef}
              type="text"
              placeholder="Replace"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px 6px 32px',
                background: 'var(--slate-bg, #0f1115)',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: 'var(--slate-text, #e4e7eb)',
                fontSize: 12,
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  replaceAll();
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  replace();
                }
              }}
            />
          </div>
          <button
            onClick={replace}
            disabled={!searchTerm || !replaceTerm}
            style={{
              padding: '6px 12px',
              background: 'var(--slate-accent, #3f8cff)',
              border: 'none',
              borderRadius: 4,
              color: '#FFFFFF',
              cursor: searchTerm && replaceTerm ? 'pointer' : 'not-allowed',
              opacity: searchTerm && replaceTerm ? 1 : 0.5,
              fontSize: 12,
            }}
          >
            Replace
          </button>
          <button
            onClick={replaceAll}
            disabled={!searchTerm || !replaceTerm}
            style={{
              padding: '6px 12px',
              background: 'var(--slate-accent, #3f8cff)',
              border: 'none',
              borderRadius: 4,
              color: '#FFFFFF',
              cursor: searchTerm && replaceTerm ? 'pointer' : 'not-allowed',
              opacity: searchTerm && replaceTerm ? 1 : 0.5,
              fontSize: 12,
            }}
          >
            Replace All
          </button>
        </div>
      )}

      {/* Toggle Replace Mode */}
      <div style={{ marginTop: 4 }}>
        <button
          onClick={() => setIsReplaceMode(!isReplaceMode)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-text-muted, #9ba1aa)',
            cursor: 'pointer',
            fontSize: 11,
            textDecoration: isReplaceMode ? 'underline' : 'none',
          }}
        >
          {isReplaceMode ? '▼ Replace' : '▶ Replace'}
        </button>
      </div>
    </div>
  );
};

export default SearchReplace;

