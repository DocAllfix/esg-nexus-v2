import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Cloud, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SyncIndicator() {
  const isMutating = useIsMutating();
  const isFetching = useIsFetching();
  const busy = isMutating > 0 || isFetching > 0;

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
