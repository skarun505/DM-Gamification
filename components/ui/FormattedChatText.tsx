'use client';

import React from 'react';

interface FormattedChatTextProps {
  text: string;
  isUser?: boolean;
  className?: string;
}

/**
 * Sanitizes messy ASCII boxes and clumsy table borders from chat text.
 * Replaces ASCII borders (┌, ┐, └, ┘, │, ─, |, -----) with clean mobile-responsive text.
 */
function cleanAsciiBorders(raw: string): string {
  // Remove fenced text markers if empty or simple
  let cleaned = raw;

  // Split lines and clean individual lines
  const lines = cleaned.split('\n');
  const processedLines: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Skip pure border lines (e.g. ┌──────┐, ├──────┤, └──────┘, +-------+, ------, ======)
    if (
      /^[┌┐└┘├┤─┬┴┼\-_=+~*]{3,}$/.test(trimmed) ||
      /^\|[-=+\s|]+\|$/.test(trimmed)
    ) {
      continue;
    }

    // Strip leading and trailing box pipe characters: │ text │ or | text |
    let cleanedLine = line
      .replace(/^[│|]\s?/, '')
      .replace(/\s?[│|]$/, '')
      .replace(/^[┌├└]\s?/, '')
      .replace(/\s?[┐┤┘]$/, '');

    // Replace multiple internal pipes like "| |" with clean separators or spaces
    cleanedLine = cleanedLine.replace(/\|\s*\|+/g, '•');
    cleanedLine = cleanedLine.replace(/│/g, ' ');

    processedLines.push(cleanedLine);
  }

  return processedLines.join('\n');
}

/**
 * Helper to render inline markdown styles: **bold**, `code`, and links.
 */
function renderInlineFormatted(
  text: string,
  isUser: boolean,
  keyPrefix: string
): React.ReactNode[] {
  // Regex to split on bold (**text**) and inline code (`code`)
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={key}
          className={
            isUser
              ? 'font-extrabold text-white underline-offset-2'
              : 'font-extrabold text-slate-900 dark:text-white'
          }
        >
          {boldText}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={key}
          className={
            isUser
              ? 'bg-indigo-700/60 text-white px-1 py-0.5 rounded text-[11px] font-mono'
              : 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700 px-1 py-0.5 rounded text-[11px] font-mono'
          }
        >
          {codeText}
        </code>
      );
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

/**
 * FormattedChatText parses chat message strings into clean, beautiful,
 * mobile-responsive HTML blocks with bold text, bullet points, callout cards,
 * and zero clumsy raw asterisks or broken ASCII borders.
 */
export function FormattedChatText({
  text,
  isUser = false,
  className = '',
}: FormattedChatTextProps) {
  if (!text) return null;

  // 1. Clean ASCII artifacts and pipe boxes
  const cleanText = cleanAsciiBorders(text);

  // 2. Separate into blocks (handling code blocks vs paragraphs)
  // Split on triple backticks
  const codeBlockRegex = /```(?:[a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g;
  const blocks: { type: 'text' | 'code'; content: string }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: cleanText.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: 'code',
      content: match[1].trim(),
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    blocks.push({
      type: 'text',
      content: cleanText.slice(lastIndex),
    });
  }

  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          // Render code/formula in a clean, high-contrast visual card
          return (
            <div
              key={`block-${bIdx}`}
              className={
                isUser
                  ? 'my-2 p-2.5 rounded-xl bg-indigo-700/60 border border-indigo-400/30 text-xs font-mono whitespace-pre-wrap'
                  : 'my-2.5 p-3 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-slate-800/90 dark:to-slate-900 border border-indigo-100 dark:border-slate-700/80 text-xs font-mono text-slate-800 dark:text-slate-200 shadow-xs whitespace-pre-wrap leading-relaxed'
              }
            >
              {cleanAsciiBorders(block.content)}
            </div>
          );
        }

        // Render standard text with paragraphs and bullets
        const paragraphs = block.content.split(/\n{2,}/);

        return (
          <div key={`block-${bIdx}`} className="space-y-2">
            {paragraphs.map((p, pIdx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Check if paragraph consists of multiple single lines (e.g. bullet points)
              const lines = trimmed.split('\n');

              // If it's a single line or multiple lines
              if (lines.length > 1) {
                return (
                  <div key={`p-${bIdx}-${pIdx}`} className="space-y-1">
                    {lines.map((line, lIdx) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;

                      const isBullet =
                        trimmedLine.startsWith('•') ||
                        trimmedLine.startsWith('- ') ||
                        trimmedLine.startsWith('* ');

                      const bulletCleaned = isBullet
                        ? trimmedLine.replace(/^[•\-*]\s*/, '')
                        : trimmedLine;

                      return (
                        <div
                          key={`l-${lIdx}`}
                          className={
                            isBullet
                              ? 'flex items-start gap-2 pl-1'
                              : 'leading-relaxed'
                          }
                        >
                          {isBullet && (
                            <span
                              className={`shrink-0 select-none ${
                                isUser ? 'text-indigo-200' : 'text-indigo-500 font-bold'
                              }`}
                            >
                              •
                            </span>
                          )}
                          <div className="flex-1">
                            {renderInlineFormatted(
                              bulletCleaned,
                              isUser,
                              `line-${bIdx}-${pIdx}-${lIdx}`
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // Single line paragraph
              const isBullet =
                trimmed.startsWith('•') ||
                trimmed.startsWith('- ') ||
                trimmed.startsWith('* ');

              const bulletCleaned = isBullet
                ? trimmed.replace(/^[•\-*]\s*/, '')
                : trimmed;

              return (
                <div
                  key={`p-${bIdx}-${pIdx}`}
                  className={
                    isBullet
                      ? 'flex items-start gap-2 pl-1'
                      : 'leading-relaxed'
                  }
                >
                  {isBullet && (
                    <span
                      className={`shrink-0 select-none ${
                        isUser ? 'text-indigo-200' : 'text-indigo-500 font-bold'
                      }`}
                    >
                      •
                    </span>
                  )}
                  <div className="flex-1">
                    {renderInlineFormatted(
                      bulletCleaned,
                      isUser,
                      `para-${bIdx}-${pIdx}`
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

