"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastItem {
  id: number;
  kind: "success" | "error";
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastIcon({ kind }: { kind: ToastItem["kind"] }) {
  if (kind === "success") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="12" cy="12" r="10" fill="#22a55b" />
        <path d="m8 12.5 2.7 2.7L16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="#b3261e" />
      <path d="M12 7v6m0 4v.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((kind: ToastItem["kind"], message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value: ToastContextValue = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[360px]"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-in pointer-events-auto flex w-full items-center gap-3 rounded-[14px] px-4 py-3 shadow-lg ${
              toast.kind === "success" ? "bg-[#1d5a9a]" : "bg-[#8f1d1d]"
            }`}
          >
            <ToastIcon kind={toast.kind} />
            <p className="text-[15px] font-medium text-white">{toast.message}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.toast-in { animation: toast-in 0.25s ease-out; }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}
