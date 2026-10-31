import React from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '' }) => {
  // Parse text for $$ ... $$ (display mode) and $ ... $ (inline mode)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Split by block math first: $$ ... $$
    const blockParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

    return blockParts.map((blockPart, blockIdx) => {
      if (blockPart.startsWith('$$') && blockPart.endsWith('$$')) {
        const math = blockPart.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${blockIdx}`}
              className="my-3 overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={`block-${blockIdx}`}>{math}</pre>;
        }
      }

      // Inline math parsing: $ ... $
      const inlineParts = blockPart.split(/(\$[^\$\n]+?\$)/g);
      return (
        <span key={`inline-block-${blockIdx}`}>
          {inlineParts.map((part, inlineIdx) => {
            if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
              const math = part.slice(1, -1).trim();
              try {
                const html = katex.renderToString(math, {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`math-${inlineIdx}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch {
                return <code key={`math-${inlineIdx}`}>{part}</code>;
              }
            }

            // Standard text with bold / code parsing
            const subParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
            return subParts.map((sub, subIdx) => {
              if (sub.startsWith('`') && sub.endsWith('`')) {
                return (
                  <code
                    key={`code-${subIdx}`}
                    className="px-1.5 py-0.5 rounded text-xs md:text-sm font-mono-code bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700"
                  >
                    {sub.slice(1, -1)}
                  </code>
                );
              }
              if (sub.startsWith('**') && sub.endsWith('**')) {
                return (
                  <strong key={`strong-${subIdx}`} className="font-semibold text-slate-900 dark:text-slate-100">
                    {sub.slice(2, -2)}
                  </strong>
                );
              }
              return sub;
            });
          })}
        </span>
      );
    });
  };

  return (
    <div className={`leading-relaxed text-slate-700 dark:text-slate-300 ${className}`}>
      {content.split('\n\n').map((paragraph, pIdx) => (
        <p key={pIdx} className="mb-3 last:mb-0">
          {renderFormattedText(paragraph)}
        </p>
      ))}
    </div>
  );
};
