import { useState, useEffect, RefObject } from 'react';

export interface UseResizablePanelsOptions {
  storagePrefix: string;
  defaultLeftWidth?: number; // percentage (e.g. 45)
  defaultConsoleHeight?: number; // px (e.g. 260)
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minConsoleHeight?: number;
  containerRef: RefObject<HTMLElement | null>;
  editorColumnRef: RefObject<HTMLElement | null>;
}

export function useResizablePanels({
  storagePrefix,
  defaultLeftWidth = 45,
  defaultConsoleHeight = 260,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  minConsoleHeight = 36,
  containerRef,
  editorColumnRef,
}: UseResizablePanelsOptions) {
  const [leftPaneWidth, setLeftPaneWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_left_width`);
      return saved ? Number(saved) : defaultLeftWidth;
    } catch {
      return defaultLeftWidth;
    }
  });

  const [consoleHeight, setConsoleHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_console_height`);
      return saved ? Number(saved) : defaultConsoleHeight;
    } catch {
      return defaultConsoleHeight;
    }
  });

  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const [isDraggingConsole, setIsDraggingConsole] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [isConsoleMaximized, setIsConsoleMaximized] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Horizontal Left/Right Splitter
      if (isDraggingSplitter && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidthPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const clamped = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidthPercent));
        setLeftPaneWidth(Math.round(clamped));
        try {
          localStorage.setItem(`${storagePrefix}_left_width`, Math.round(clamped).toString());
        } catch {
          // ignore
        }
      }

      // 2. Vertical Up/Down Console Splitter
      if (isDraggingConsole && editorColumnRef.current) {
        const rect = editorColumnRef.current.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        const maxHeight = Math.max(100, rect.height - 100);
        const clamped = Math.max(minConsoleHeight, Math.min(maxHeight, newHeight));
        setConsoleHeight(Math.round(clamped));
        if (clamped > minConsoleHeight && !showConsole) {
          setShowConsole(true);
        }
        if (isConsoleMaximized) {
          setIsConsoleMaximized(false);
        }
        try {
          localStorage.setItem(`${storagePrefix}_console_height`, Math.round(clamped).toString());
        } catch {
          // ignore
        }
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter) setIsDraggingSplitter(false);
      if (isDraggingConsole) setIsDraggingConsole(false);
    };

    if (isDraggingSplitter || isDraggingConsole) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDraggingSplitter,
    isDraggingConsole,
    showConsole,
    isConsoleMaximized,
    storagePrefix,
    minLeftWidth,
    maxLeftWidth,
    minConsoleHeight,
    containerRef,
    editorColumnRef
  ]);

  return {
    leftPaneWidth,
    setLeftPaneWidth,
    consoleHeight,
    setConsoleHeight,
    isDraggingSplitter,
    setIsDraggingSplitter,
    isDraggingConsole,
    setIsDraggingConsole,
    showConsole,
    setShowConsole,
    isConsoleMaximized,
    setIsConsoleMaximized,
  };
}
