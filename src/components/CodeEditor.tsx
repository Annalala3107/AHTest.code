import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  onRun?: () => void;
  onSubmit?: () => void;
  onNextLesson?: () => void;
  onMount?: (editor: any, monaco: any) => void;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  showCharBadge?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'c',
  height = '100%',
  onRun,
  onSubmit,
  onNextLesson,
  onMount,
  readOnly = false,
  className = '',
  maxLength = 5000,
  showCharBadge = true,
}) => {
  const editorRef = useRef<any>(null);
  const onNextLessonRef = useRef(onNextLesson);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onNextLessonRef.current = onNextLesson;
    onRunRef.current = onRun;
    onSubmitRef.current = onSubmit;
  }, [onNextLesson, onRun, onSubmit]);

  // Map internal language identifiers to Monaco supported languages
  const getMonacoLanguage = (lang: string): string => {
    if (lang === 'c17' || lang === 'c') return 'c';
    if (lang.startsWith('cpp')) return 'cpp';
    if (lang === 'py3' || lang === 'python') return 'python';
    if (lang === 'java') return 'java';
    if (lang === 'rust') return 'rust';
    return 'c';
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Ctrl+Enter or Cmd+Enter for Submit / Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onSubmitRef.current) {
        onSubmitRef.current();
      } else if (onRunRef.current) {
        onRunRef.current();
      }
    });

    // Register Shift+Enter for Next Lesson (when passed)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      if (onNextLessonRef.current) {
        onNextLessonRef.current();
      }
    });

    // Register F9 for Run Sample
    editor.addCommand(monaco.KeyCode.F9, () => {
      if (onRunRef.current) {
        onRunRef.current();
      }
    });

    // Custom dark theme palette aligning with Slate-950
    monaco.editor.defineTheme('ahtest-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fb923c' },
        { token: 'type', foreground: '38bdf8', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#020617', // slate-950
        'editor.foreground': '#f8fafc', // slate-50
        'editorLineNumber.foreground': '#475569', // slate-600
        'editorLineNumber.activeForeground': '#cbd5e1', // slate-300
        'editor.selectionBackground': '#3b82f640',
        'editor.lineHighlightBackground': '#0f172a80', // slate-900
        'editorCursor.foreground': '#f43f5e', // rose-500
      }
    });
    monaco.editor.setTheme('ahtest-dark');

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleCodeChange = (val: string | undefined) => {
    const text = val || '';
    if (maxLength && text.length > maxLength) {
      onChange(text.slice(0, maxLength));
    } else {
      onChange(text);
    }
  };

  return (
    <div className={`w-full h-full min-h-[240px] relative overflow-hidden bg-slate-950 ${className}`}>
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono gap-2 bg-slate-950">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Đang tải Monaco Editor v0.57...</span>
          </div>
        }
        options={{
          readOnly,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          contextmenu: true,
          folding: true,
          renderLineHighlight: 'all',
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />

      {/* Real-time 5000-character Floating Gauge */}
      {showCharBadge && (
        <div 
          className={`absolute bottom-2.5 right-4 z-10 px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-xs select-none pointer-events-none transition-all shadow-xs ${
            value.length >= maxLength
              ? 'bg-rose-950/90 text-rose-300 border-rose-600 font-bold animate-pulse'
              : value.length >= maxLength * 0.9
              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
              : 'bg-slate-900/80 text-slate-400 border-slate-800'
          }`}
        >
          {value.length.toLocaleString('vi-VN')} / {maxLength.toLocaleString('vi-VN')} ký tự
        </div>
      )}
    </div>
  );
};
