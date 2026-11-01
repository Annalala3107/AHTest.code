import React from 'react';
import katex from 'katex';

interface InlineMathProps {
  text: string;
  className?: string;
}

export const InlineMath: React.FC<InlineMathProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by inline math delimiter $...$
  const parts = text.split(/(\$[^$\n]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false
            });
            return (
              <span
                key={idx}
                dangerouslySetInnerHTML={{ __html: html }}
                className="inline-block px-0.5 text-slate-800 dark:text-slate-100 font-serif"
              />
            );
          } catch {
            return (
              <span key={idx} className="font-serif italic font-semibold px-0.5">
                {math}
              </span>
            );
          }
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};
