import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import {
  subscribeToToasts,
  subscribeToConfirm,
  type ToastItem,
  type ConfirmRequest,
} from '../../services/uiFeedback';

export const GlobalFeedbackHost: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmQueue, setConfirmQueue] = useState<ConfirmRequest[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const activeTimers = timersRef.current;
    const unsubToast = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev.slice(-4), toast]);
      const timer = setTimeout(() => {
        activeTimers.delete(toast.id);
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, Math.max(1200, toast.durationMs));
      activeTimers.set(toast.id, timer);
    });

    const unsubConfirm = subscribeToConfirm((req) => {
      setConfirmQueue((prev) => [...prev, req]);
    });

    return () => {
      unsubToast();
      unsubConfirm();
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const activeConfirm = confirmQueue[0] || null;

  const resolveActiveConfirm = useCallback(
    (accepted: boolean) => {
      if (!activeConfirm) return;
      activeConfirm.resolve(accepted);
      setConfirmQueue((prev) => prev.slice(1));
    },
    [activeConfirm]
  );

  useEffect(() => {
    if (!activeConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resolveActiveConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeConfirm, resolveActiveConfirm]);

  const variantStyles: Record<ToastItem['variant'], string> = {
    success:
      'bg-emerald-950/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50',
    error:
      'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-950/50',
    warning:
      'bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-950/50',
    info:
      'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/50',
  };

  const renderToastIcon = (variant: ToastItem['variant']) => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <>
      {/* Non-blocking Toast Stack */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          role="status"
          className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-2.5 text-xs leading-relaxed animate-slideUp ${variantStyles[toast.variant]}`}
            >
              {renderToastIcon(toast.variant)}
              <p className="flex-1 whitespace-pre-line font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Đóng thông báo"
                className="p-0.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Accessible Confirmation Dialog */}
      {activeConfirm && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="ah-confirm-title"
          aria-describedby="ah-confirm-message"
          onClick={() => resolveActiveConfirm(false)}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-scaleUp"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  activeConfirm.variant === 'danger'
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : activeConfirm.variant === 'warning'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3
                  id="ah-confirm-title"
                  className="text-base font-extrabold text-slate-900 dark:text-white"
                >
                  {activeConfirm.title}
                </h3>
                <p
                  id="ah-confirm-message"
                  className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line"
                >
                  {activeConfirm.message}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => resolveActiveConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {activeConfirm.cancelLabel || 'Hủy bỏ'}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => resolveActiveConfirm(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                  activeConfirm.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                    : activeConfirm.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                {activeConfirm.confirmLabel || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
