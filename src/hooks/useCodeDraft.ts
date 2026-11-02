import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseCodeDraftOptions {
  draftKey: string;
  defaultCode: string;
  isLeakedCheck?: (saved: string) => boolean;
  debounceMs?: number;
}

export function useCodeDraft({
  draftKey,
  defaultCode,
  isLeakedCheck,
  debounceMs = 600,
}: UseCodeDraftOptions) {
  const [code, setCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved !== null) {
        if (isLeakedCheck && isLeakedCheck(saved)) {
          localStorage.removeItem(draftKey);
          return defaultCode;
        }
        return saved;
      }
      return defaultCode;
    } catch {
      return defaultCode;
    }
  });

  const [draftSaved, setDraftSaved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(draftKey) !== null;
    } catch {
      return false;
    }
  });

  const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);

  const [prevKey, setPrevKey] = useState(draftKey);
  if (prevKey !== draftKey) {
    setPrevKey(draftKey);
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved !== null) {
        if (isLeakedCheck && isLeakedCheck(saved)) {
          localStorage.removeItem(draftKey);
          setCode(defaultCode);
          setDraftSaved(false);
        } else {
          setCode(saved);
          setDraftSaved(true);
        }
      } else {
        setCode(defaultCode);
        setDraftSaved(false);
      }
    } catch {
      setCode(defaultCode);
      setDraftSaved(false);
    }
  }

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceSaveRef.current) {
        clearTimeout(debounceSaveRef.current);
        debounceSaveRef.current = null;
      }
    };
  }, []);

  const flushPendingDraft = useCallback((currentCode?: string) => {
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
      debounceSaveRef.current = null;
    }
    const target = currentCode !== undefined ? currentCode : code;
    try {
      localStorage.setItem(draftKey, target);
      setDraftSaved(true);
    } catch {
      // ignore
    }
  }, [draftKey, code]);

  const handleCodeChange = useCallback((newVal: string) => {
    setCode(newVal);
    setDraftSaved(false);

    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
    }
    debounceSaveRef.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, newVal);
        setDraftSaved(true);
      } catch {
        // ignore
      }
    }, debounceMs);
  }, [draftKey, debounceMs]);

  return {
    code,
    setCode,
    draftSaved,
    setDraftSaved,
    flushPendingDraft,
    handleCodeChange,
  };
}
