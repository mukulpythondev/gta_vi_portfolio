"use client";
import { useEffect, useRef } from "react";
export function useModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const originalOpener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = dialog.current;
    if (
      !originalOpener.current &&
      document.activeElement instanceof HTMLElement &&
      !element?.contains(document.activeElement)
    ) {
      originalOpener.current = document.activeElement;
    }
    element?.showModal();
    return () => {
      queueMicrotask(() => {
        if (!element?.isConnected && originalOpener.current?.isConnected)
          originalOpener.current.focus({ preventScroll: true });
      });
    };
  }, []);
  return dialog;
}
