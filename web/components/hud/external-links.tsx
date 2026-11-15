"use client";
import { useEffect } from "react";

/**
 * Any link that leaves the site (GitHub, LinkedIn, demos, certificates) opens in
 * a new tab, so visitors never lose their place in the portfolio. Handled with
 * one delegated listener instead of touching rendered attributes, which keeps
 * hydration clean and covers links added later.
 */
export function ExternalLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      const external = /^https?:$/.test(url.protocol) && url.origin !== location.origin;
      const pdf = url.pathname.toLowerCase().endsWith(".pdf");
      if (!external && !pdf) return;
      event.preventDefault();
      window.open(url.href, "_blank", "noopener,noreferrer");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
