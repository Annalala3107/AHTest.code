/**
 * Global UI Feedback Bus (Pure TypeScript, zero React dependencies).
 * Replaces blocking native alert and confirm dialogs with
 * accessible, non-blocking toasts and confirmation dialogs, while remaining
 * safe inside Node.js test environments.
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export interface ConfirmRequest extends ConfirmOptions {
  id: string;
  resolve: (confirmed: boolean) => void;
}

type ToastListener = (toast: ToastItem) => void;
type ConfirmListener = (request: ConfirmRequest) => void;

const toastListeners = new Set<ToastListener>();
const confirmListeners = new Set<ConfirmListener>();

let feedbackCounter = 0;

/**
 * Subscribe to toast notifications. Returns an unsubscribe function.
 */
export function subscribeToToasts(listener: ToastListener): () => void {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

/**
 * Subscribe to confirmation modal requests. Returns an unsubscribe function.
 */
export function subscribeToConfirm(listener: ConfirmListener): () => void {
  confirmListeners.add(listener);
  return () => {
    confirmListeners.delete(listener);
  };
}

/**
 * Emit a non-blocking toast notification. Safe no-op if no UI host is mounted.
 */
export function showToast(
  message: string,
  variant: ToastVariant = 'info',
  durationMs: number = 3800
): void {
  feedbackCounter += 1;
  const item: ToastItem = {
    id: `toast_${Date.now()}_${feedbackCounter}`,
    message,
    variant,
    durationMs,
  };
  toastListeners.forEach((listener) => {
    listener(item);
  });
}

/**
 * Request an accessible confirmation dialog. Resolves false if no UI host is mounted.
 */
export function askConfirm(options: ConfirmOptions): Promise<boolean> {
  if (confirmListeners.size === 0) {
    return Promise.resolve(false);
  }

  return new Promise<boolean>((resolve) => {
    feedbackCounter += 1;
    const request: ConfirmRequest = {
      ...options,
      id: `confirm_${Date.now()}_${feedbackCounter}`,
      resolve,
    };
    const [firstListener] = Array.from(confirmListeners);
    if (firstListener) {
      firstListener(request);
    } else {
      resolve(false);
    }
  });
}
