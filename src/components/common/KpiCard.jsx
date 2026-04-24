import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ title, value, unit, trend, trendLabel, icon: Icon, iconColor, variant = "default", className }) {
  const isWarning = variant === "warning";
  const isDanger = variant === "danger";

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-5 flex flex-col gap-3",
      className
    )}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
        {Icon && (
          <div className={cn("p-2 rounded-md", iconColor || "bg-muted")}>
            <Icon size={16} className={isDanger ? "text-red-600" : isWarning ? "text-amber-600" : "text-primary"} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn(
          "text-3xl font-semibold tabular-nums tracking-tight",
          isDanger && "text-red-600",
          isWarning && "text-amber-600"
        )}>
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground pb-1">{unit}</span>}
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center gap-1 text-xs">
          {trend > 0 && <TrendingUp size={13} className="text-green-600" />}
          {trend < 0 && <TrendingDown size={13} className="text-red-600" />}
          <span className={cn(
            "font-medium",
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground"
          )}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}