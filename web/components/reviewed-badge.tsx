"use client";
import { CheckCircle2 } from "lucide-react";
import { useGame } from "@/lib/game-store";
export function ReviewedBadge({ id }: { id: string }) {
  const state = useGame();
  if (!state.completed.includes(id)) return null;
  return (
    <span className="reviewed-badge">
      <CheckCircle2 size={14} /> Reviewed
    </span>
  );
}
