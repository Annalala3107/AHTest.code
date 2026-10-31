import React, { useState } from 'react';
import katex from 'katex';
import { 
  Copy, 
  Check, 
  Lightbulb, 
  Info, 
  AlertTriangle, 
  ShieldAlert, 
  Target, 
  Terminal 
} from 'lucide-react';

interface KaTeXRendererProps {
  content: string;
  className?: string;
}

// Lightweight, vibrant C/C++ syntax highlighter
function highlightCCode(rawCode: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = rawCode.split('\n');
  return lines.map((line) => {
    // Whole line comment
    if (line.trim().startsWith('//')) {
      return `<span class="text-slate-400 italic">${escapeHtml(line)}</span>`;
    }
    // Preprocessor line
    if (line.trim().startsWith('#')) {
      return `<span class="text-sky-400 font-semibold">${escapeHtml(line)}</span>`;
    }

    // Tokenizer regex for C/C++
    const tokenRegex = /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:int|void|char|float|double|long|short|unsigned|signed|struct|typedef|enum|union|const|static|return|if|else|switch|case|break|default|for|while|do|continue|goto|sizeof|NULL)\b|\b(?:printf|scanf|malloc|calloc|realloc|free|fgets|getchar|putchar|puts|sqrt|abs|pow|strcmp|strcpy|strlen|strcspn|main|cin|cout|endl)\b|\b\d+(?:\.\d+)?f?\b|->|\*|&|==|!=|<=|>=|&&|\|\||[+\-%]=?)/g;

    let result = '';
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        result += escapeHtml(line.slice(lastIdx, match.index));
      }
      const token = match[0];
      if (token.startsWith('//')) {
        result += `<span class="text-slate-400 italic">${escapeHtml(token)}</span>`;
      } else if (token.startsWith('"') || token.startsWith("'")) {
        result += `<span class="text-emerald-400 font-medium">${escapeHtml(token)}</span>`;
      } else if (/^(int|void|char|float|double|long|short|unsigned|signed|struct|typedef|enum|union|const|static|return|if|else|switch|case|break|default|for|while|do|continue|goto|sizeof|NULL)$/.test(token)) {
        result += `<span class="text-purple-400 font-bold">${escapeHtml(token)}</span>`;
      } else if (/^(printf|scanf|malloc|calloc|realloc|free|fgets|getchar|putchar|puts|sqrt|abs|pow|strcmp|strcpy|strlen|strcspn|main|cin|cout|endl)$/.test(token)) {
        result += `<span class="text-amber-300 font-semibold">${escapeHtml(token)}</span>`;
      } else if (/^\d/.test(token)) {
        result += `<span class="text-orange-400 font-mono">${escapeHtml(token)}</span>`;
      } else if (/^(->|\*|&|==|!=|<=|>=|&&|\|\|)$/.test(token)) {
        result += `<span class="text-rose-400 font-bold">${escapeHtml(token)}</span>`;
      } else {
        result += escapeHtml(token);
      }
      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < line.length) {
      result += escapeHtml(line.slice(lastIdx));
    }
    return result;
  }).join('\n');
}

// Code Block with window controls, copy button & syntax highlight
const CodeBlockCard: React.FC<{ code: string; language?: string }> = ({ code, language = 'c' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-slate-400 font-bold uppercase text-[10px] ml-1.5 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-indigo-400" />
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
          title="Sao chép mã nguồn"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Đã chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
        <code dangerouslySetInnerHTML={{ __html: highlightCCode(code) }} />
      </pre>
    </div>
  );
};

// Normalize markdown to prevent single newlines from collapsing blocks
function normalizeMarkdown(raw: string): string {
  if (!raw) return '';
  const codeBlocks: string[] = [];
  let text = raw.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  const mathBlocks: string[] = [];
  text = text.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    mathBlocks.push(match);
    return `___MATH_BLOCK_${mathBlocks.length - 1}___`;
  });

  // Ensure squashed tables with double pipes || get broken into proper newlines
  text = text.replace(/\|\|\s*([:\-a-zA-Z0-9`\*\(\\\$])/g, '|\n| $1');

  // Ensure squashed inline numbered lists (e.g. "1. Step A. 2. Step B.") split into lines
  text = text.replace(/([^\n])\s+(\d+\.\s+[A-ZÀ-Ỹa-ỹ\*\$])/g, '$1\n\n$2');

  // Ensure alerts starting with [!TAG] without > are formatted with >
  text = text.replace(/(^|\n)\s*\[!(CAUTION|WARNING|TIP|NOTE|INFO|IMPORTANT)\]/gim, '$1> [!$2]');

  // Ensure headings have blank lines around them
  text = text.replace(/([^\n])\n(#{1,4}\s+[^\n]+)/g, '$1\n\n$2');
  text = text.replace(/(#{1,4}\s+[^\n]+)\n([^\n#])/g, '$1\n\n$2');

  // Ensure tables have blank lines around them
  text = text.replace(/([^\n])\n(\|[^\n]+\|)/g, '$1\n\n$2');
  text = text.replace(/(\|[^\n]+\|)\n([^\n|])/g, '$1\n\n$2');

  // Ensure blockquotes have blank lines around them
  text = text.replace(/([^\n])\n(>[^\n]+)/g, '$1\n\n$2');
  text = text.replace(/(>[^\n]+)\n([^>\n])/g, '$1\n\n$2');

  // Restore code and math blocks
  text = text.replace(/___CODE_BLOCK_(\d+)___/g, (_, idx) => codeBlocks[Number(idx)]);
  text = text.replace(/___MATH_BLOCK_(\d+)___/g, (_, idx) => mathBlocks[Number(idx)]);

  return text;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '' }) => {
  // Helper to parse inline Math, Code, Bold, and Italic
  const renderInlineFormatted = (text: string) => {
    if (!text) return null;

    // Inline math: $ ... $
    const inlineParts = text.split(/(\$[^\$\n]+?\$)/g);

    return inlineParts.map((part, inlineIdx) => {
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

      // Inline code (`...`), bold (**...**), and italic (*...*)
      const subParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return subParts.map((sub, subIdx) => {
        // Inline Code: Sophisticated indigo/cyan badge (pleasant, non-fatiguing)
        if (sub.startsWith('`') && sub.endsWith('`')) {
          return (
            <code
              key={`code-${subIdx}`}
              className="px-1.5 py-0.5 mx-0.5 rounded-md font-mono-code text-xs sm:text-sm font-semibold bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs"
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        // Bold
        if (sub.startsWith('**') && sub.endsWith('**')) {
          return (
            <strong key={`strong-${subIdx}`} className="font-bold text-slate-900 dark:text-white">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        // Italic
        if (sub.startsWith('*') && sub.endsWith('*')) {
          return (
            <em key={`em-${subIdx}`} className="italic text-slate-800 dark:text-slate-200 font-medium">
              {sub.slice(1, -1)}
            </em>
          );
        }
        return sub;
      });
    });
  };

  // Parse markdown tables
  const renderTable = (tableBlock: string, blockKey: string | number) => {
    const lines = tableBlock.trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return <p key={blockKey}>{tableBlock}</p>;

    const headerCols = lines[0].split('|').slice(1, -1).map(c => c.trim());
    const dataRows = lines.slice(2).map(line => line.split('|').slice(1, -1).map(c => c.trim()));

    return (
      <div key={blockKey} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              {headerCols.map((col, idx) => (
                <th key={idx} className="px-4 py-3">
                  {renderInlineFormatted(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/50">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                    {renderInlineFormatted(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main block parser
  const renderBlocks = () => {
    if (!content) return null;

    const normalizedContent = normalizeMarkdown(content);
    // Major split by code blocks ``` ... ``` and block math $$ ... $$
    const majorRegex = /(```(?:[a-zA-Z]*)\n[\s\S]*?```|\$\$[\s\S]*?\$\$)/g;
    const parts = normalizedContent.split(majorRegex);

    return parts.map((part, pIdx) => {
      // 1. Fenced Code Block
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineEnd = part.indexOf('\n');
        const lang = part.slice(3, firstLineEnd).trim() || 'c';
        const code = part.slice(firstLineEnd + 1, -3).trim();
        return <CodeBlockCard key={`code-block-${pIdx}`} code={code} language={lang} />;
      }

      // 2. Block Math $$ ... $$
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`math-block-${pIdx}`}
              className="my-3 overflow-x-auto py-1 text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={`math-block-${pIdx}`}>{math}</pre>;
        }
      }

      // 3. Normal text - split by double newlines into blocks
      const subParagraphs = part.split(/\n\s*\n/g);

      return (
        <div key={`sub-${pIdx}`} className="space-y-3.5">
          {subParagraphs.map((para, paraIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            // Mission / Challenge Card (Thử thách)
            const isChallenge = /^(?:#{1,3}\s*)?(?:\d+\.\s*)?(?:Thử thách|Challenge)/i.test(trimmed);
            if (isChallenge) {
              const lines = trimmed.split('\n');
              const match = lines[0].match(/^(?:#{1,3}\s*)?(?:\d+\.\s*)?(?:Thử thách|Challenge)[:\s]*(.*)/i);
              const inlinePrompt = match ? match[1].trim() : '';
              const restLines = lines.slice(1).map(l => l.trim()).filter(Boolean);
              const fullDescription = [inlinePrompt, ...restLines].filter(Boolean).join('\n');

              return (
                <div 
                  key={`challenge-${paraIdx}`}
                  className="my-4 p-4 sm:p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Target className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-indigo-950 dark:text-indigo-200 uppercase tracking-wide">
                      Nhiệm vụ Thử thách
                    </h4>
                  </div>
                  {fullDescription && (
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {renderInlineFormatted(fullDescription)}
                    </div>
                  )}
                </div>
              );
            }

            // Headings: ### Title or ## Title (NO FLOATING RED PILL!)
            if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
              const lines = trimmed.split('\n');
              const headingText = lines[0].replace(/^#{1,3}\s*/, '');
              const restOfBlock = lines.slice(1).join('\n').trim();

              return (
                <div key={`heading-group-${paraIdx}`} className="space-y-2 pt-2">
                  <div className="pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {renderInlineFormatted(headingText)}
                    </h3>
                  </div>
                  {restOfBlock && (
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {renderInlineFormatted(restOfBlock)}
                    </div>
                  )}
                </div>
              );
            }

            // Markdown Table: lines with | ... |
            if (trimmed.startsWith('|') || (trimmed.includes('\n|') && trimmed.includes('| :---'))) {
              return renderTable(trimmed, `table-${paraIdx}`);
            }

            // Alert Box: > [!CAUTION], > [!TIP], > [!WARNING], > [!NOTE], etc.
            const isAlert = trimmed.startsWith('>') || /^\[!(CAUTION|WARNING|TIP|NOTE|INFO|IMPORTANT)\]/i.test(trimmed);
            if (isAlert) {
              const isCaution = /\[!CAUTION\]/i.test(trimmed);
              const isWarning = /\[!WARNING\]/i.test(trimmed);
              const isTip = /\[!TIP\]/i.test(trimmed);

              const cleanText = trimmed
                .replace(/^>*\s*\[!(CAUTION|WARNING|TIP|NOTE|INFO|IMPORTANT)\]\s*/gim, '')
                .replace(/^>\s*/gm, '')
                .trim();

              const alertTitle = isCaution
                ? 'Lưu ý An toàn & Bảo mật'
                : isWarning
                ? 'Cảnh báo Lỗi thường gặp'
                : isTip
                ? 'Mẹo Lập trình Tối ưu'
                : 'Ghi chú Kỹ thuật';

              return (
                <div
                  key={`alert-${paraIdx}`}
                  className={`my-3 p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                    isCaution
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                      : isWarning
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                      : isTip
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                      : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isCaution ? (
                      <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                    ) : isTip ? (
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-[11px] sm:text-xs uppercase tracking-wider opacity-90">
                      {alertTitle}
                    </div>
                    <div>
                      {renderInlineFormatted(cleanText)}
                    </div>
                  </div>
                </div>
              );
            }

            // Numbered List: 1. ... 2. ...
            if (/^\d+\.\s+/.test(trimmed)) {
              const listLines = trimmed.split('\n');
              return (
                <div key={`numlist-${paraIdx}`} className="space-y-2.5 my-2">
                  {listLines.map((line, lIdx) => {
                    const match = line.match(/^(\d+)\.\s+(.*)/);
                    if (match) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {match[1]}
                          </span>
                          <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                            {renderInlineFormatted(match[2])}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-7 leading-relaxed">
                        {renderInlineFormatted(line)}
                      </p>
                    );
                  })}
                </div>
              );
            }

            // Bullet List: * ... or - ...
            if (/^[*•-]\s+/.test(trimmed)) {
              const listLines = trimmed.split('\n');
              return (
                <div key={`bulletlist-${paraIdx}`} className="space-y-1.5 my-2">
                  {listLines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^[*•-]\s+/, '');
                    return (
                      <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                        <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {renderInlineFormatted(cleanLine)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // Standard Paragraph
            return (
              <p key={`p-${paraIdx}`} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {renderInlineFormatted(trimmed)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`space-y-3.5 leading-relaxed text-slate-700 dark:text-slate-300 ${className}`}>
      {renderBlocks()}
    </div>
  );
};
