"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TerminalSquare, X } from "lucide-react";
import { executeCommand } from "@/lib/terminal-commands";
import { updateGame, useGame } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { unlockTrophy } from "@/lib/trophies";
import { useModal } from "@/lib/use-modal";

export default function Terminal({ onClose }: { onClose: () => void }) {
  const dialog = useModal();
  const output = useRef<HTMLDivElement>(null);
  const state = useGame();
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<
    { command: string; lines: string[]; href?: string }[]
  >([
    {
      command: "",
      lines: [
        "SOLARA OS / PERSONAL ACCESS",
        "Type help to view available commands.",
      ],
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  useEffect(() => {
    output.current?.scrollTo({ top: output.current.scrollHeight });
  }, [entries]);
  return (
    <dialog
      ref={dialog}
      className="terminal-dialog"
      data-lenis-prevent
      aria-labelledby="terminal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h2 id="terminal-title">
          <TerminalSquare size={19} />
          SOLARA TERMINAL
        </h2>
        <button
          className="icon-button"
          aria-label="Close terminal"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div
        ref={output}
        className="terminal-output"
        role="log"
        aria-live="polite"
        tabIndex={0}
      >
        {entries.map((entry, index) => (
          <div className="terminal-entry" key={index}>
            {entry.command && (
              <p className="terminal-command">
                mukul@solara:~ $ {entry.command}
              </p>
            )}
            {entry.lines.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
            {entry.href && (
              <Link onClick={onClose} href={entry.href}>
                Open destination <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        ))}
      </div>
      <form
        className="terminal-input"
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim()) return;
          const result = executeCommand(input);
          setEntries((previous) =>
            result.clear
              ? []
              : [...previous, { command: input, ...result }].slice(-50),
          );
          setHistory((previous) => [...previous, input].slice(-50));
          setHistoryIndex(0);
          if (result.secret && !state.secrets.includes("source")) {
            updateGame({ secrets: [...state.secrets, "source"] });
            audioManager.confirm(true);
            unlockTrophy("source");
          }
          setInput("");
        }}
      >
        <span aria-hidden="true">$</span>
        <label className="sr-only" htmlFor="terminal-command">
          Terminal command
        </label>
        <input
          id="terminal-command"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={input}
          maxLength={160}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const next = Math.min(historyIndex + 1, history.length);
              setHistoryIndex(next);
              setInput(history[history.length - next] ?? "");
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const next = Math.max(historyIndex - 1, 0);
              setHistoryIndex(next);
              setInput(next ? history[history.length - next] : "");
            }
          }}
        />
        <button type="submit" className="icon-button" aria-label="Run command">
          <ArrowUpRight size={20} />
        </button>
      </form>
      {state.secrets.includes("source") && (
        <div className="secret-unlocked" role="status">
          SECRET FOUND / YOU FOUND THE SOURCE
        </div>
      )}
    </dialog>
  );
}
