"use client";
import { Keyboard, MapPinned, Sparkles, Target, Trophy, X } from "lucide-react";
import { dismissToast, useToasts, type Toast } from "@/lib/toasts";

const icons: Record<Toast["kind"], typeof Trophy> = {
  achievement: Trophy,
  discovery: MapPinned,
  hint: Keyboard,
  mission: Target,
  secret: Sparkles,
};
const labels: Record<Toast["kind"], string> = {
  achievement: "Achievement unlocked",
  discovery: "New area discovered",
  hint: "Controls",
  mission: "Mission update",
  secret: "Secret found",
};

export function Toasts() {
  const toasts = useToasts();
  return (
    <section className="toasts" aria-label="Notifications" aria-live="polite">
      {/* The store only ever exposes one toast; the rest wait in a queue. */}
      {toasts.map((toast) => {
        const Icon = icons[toast.kind];
        return (
          <div className={`toast toast-${toast.kind}`} key={toast.id}>
            <span className="toast-icon">
              <Icon size={20} />
            </span>
            <span className="toast-body">
              <small>{labels[toast.kind]}</small>
              <strong>{toast.title}</strong>
              {toast.detail && <span>{toast.detail}</span>}
            </span>
            <button
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </section>
  );
}
