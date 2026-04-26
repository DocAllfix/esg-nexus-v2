import { useEffect, useRef, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Cloud, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Q5 — Global sync indicator. Shows three states:
//   busy:  any mutation or fetch in flight        (cloud + spinner)
//   ok:    just transitioned busy -> idle, 3s     (green check)
//   idle:  nothing happening                       (muted dot)
//
// Source of truth is TanStack Query's global counters; covers every hook
// (useFormData, useClienti, useEngagements, etc) without manual wiring.

export default function SyncIndicator() {
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  const busy = isMutating > 0 || isFetching > 0;

  const [justFinished, setJustFinished] = useState(false);
  const wasBusyRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (wasBusyRef.current && !busy) {
      setJustFinished(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setJustFinished(false), 2500);
    }
    wasBusyRef.current = busy;
    return () => clearTimeout(timeoutRef.current);
  }, [busy]);

  if (busy) {
    return (
      <span
        className={cn(
          "hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md",
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
        )}
        title={`In corso: ${isMutating} mutation, ${isFetching} fetch`}
        role="status"
        aria-live="polite"
      >
        <Cloud size={13} className="animate-pulse" />
        Sincronizzazione…
      </span>
    );
  }

  if (justFinished) {
    return (
      <span
        className={cn(
          "hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md",
          "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30"
        )}
        role="status"
        aria-live="polite"
      >
        <Check size={13} />
        Tutto salvato
      </span>
    );
  }

  return (
    <span
      className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      title="Nessuna operazione in corso"
    >
      <Check size={13} />
    </span>
  );
}

// Optional: simple offline indicator. Leverages window.navigator.onLine.
export function OfflineBadge() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  if (online) return null;
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-destructive/10 text-destructive border border-destructive/30">
      <AlertCircle size={13} />
      Offline
    </span>
  );
}
