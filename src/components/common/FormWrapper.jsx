import { useState, useEffect, useCallback } from "react";
import { Save, FileText, FileDown, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  non_iniziato: { label: "Non iniziato", classes: "bg-muted text-muted-foreground border-border", icon: Circle },
  in_corso:     { label: "In corso",     classes: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400", icon: Clock },
  completato:   { label: "Completato",   classes: "bg-green-500/10 text-green-700 border-green-500/30 dark:text-green-400", icon: CheckCircle2 },
};

// ─── Rule box ────────────────────────────────────────────────────────────────
const RULE_COLORS = {
  info:    "bg-blue-500/8 border-blue-500/40 text-blue-700 dark:text-blue-300",
  warning: "bg-amber-500/8 border-amber-500/40 text-amber-700 dark:text-amber-300",
  danger:  "bg-red-500/8 border-red-500/40 text-red-700 dark:text-red-300",
  success: "bg-green-500/8 border-green-500/40 text-green-700 dark:text-green-300",
};

// ─── FormWrapper ─────────────────────────────────────────────────────────────
export default function FormWrapper({
  formCode, title, subtitle, meta, ruleBox, ruleBoxType = "info",
  children, storageKey, initialData = {}
}) {
  const [status, setStatus] = useState(initialData._status || "non_iniziato");
  const [savedAt, setSavedAt] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setStatus(parsed._status || "non_iniziato");
      }
    } catch {}
  }, [storageKey]);

  const save = useCallback(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify({ ...data, _status: status }));
    setSavedAt(new Date());
  }, [storageKey, data, status]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.non_iniziato;
  const StatusIcon = cfg.icon;

  const cycleStatus = () => {
    const s = ["non_iniziato", "in_corso", "completato"];
    setStatus(s[(s.indexOf(status) + 1) % s.length]);
  };

  return (
    <div className="space-y-0">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md tracking-wider">
                  {formCode}
                </span>
                <button
                  onClick={cycleStatus}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold cursor-pointer hover:opacity-75 transition-opacity",
                    cfg.classes
                  )}
                >
                  <StatusIcon size={10} />
                  {cfg.label}
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            {savedAt && (
              <p className="text-xs text-muted-foreground shrink-0 mt-1">
                Salvato {savedAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {/* Meta info */}
          {meta && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs bg-muted/50 border border-border rounded-lg px-4 py-2.5">
              {Object.entries(meta).map(([k, v]) => (
                <span key={k} className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{k}:</span> {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Rule box */}
        {ruleBox && (
          <div className={cn("mx-6 mt-5 mb-1 p-3.5 rounded-lg border text-sm leading-relaxed", RULE_COLORS[ruleBoxType] || RULE_COLORS.info)}>
            {ruleBox}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6 pt-5 space-y-8">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <FileText size={13} /> PDF
            </button>
            <button
              onClick={() => {
                const blob = new Blob(["\ufeff<html><body>" + (document.querySelector(".form-printable")?.innerHTML || "") + "</body></html>"], { type: "application/msword" });
                const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${formCode}.doc` });
                a.click(); URL.revokeObjectURL(a.href);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <FileDown size={13} /> Word
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Save size={13} /> Salva bozza
            </button>
            <button
              onClick={() => { setStatus("completato"); save(); }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
            >
              <CheckCircle2 size={13} /> Segna completata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FormSection ─────────────────────────────────────────────────────────────
export function FormSection({ title, children, cols = 2 }) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-2";

  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border/60">
        {title}
      </h3>
      <div className={cn("grid gap-4", gridClass)}>
        {children}
      </div>
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────
export function Field({ label, required, children, span, hint }) {
  return (
    <div className={cn(span === 2 && "sm:col-span-2", span === 3 && "sm:col-span-3", span === 4 && "sm:col-span-4")}>
      {label && (
        <label className="block text-xs font-medium mb-1.5 text-foreground/80">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

// ─── Base input classes ───────────────────────────────────────────────────────
const inputBase =
  "w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors";

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ value, onChange, type = "text", placeholder, required, className, ...props }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={cn(inputBase, className)}
      {...props}
    />
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({ value, onChange, placeholder, rows = 3, className }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(inputBase, "resize-y min-h-[72px]", className)}
    />
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options = [], placeholder, className }) {
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      className={cn(inputBase, "cursor-pointer", className)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
  );
}

// ─── RadioGroup ──────────────────────────────────────────────────────────────
export function RadioGroup({ value, onChange, options = [], inline = false }) {
  return (
    <div className={cn("flex flex-col gap-2", inline && "flex-row flex-wrap gap-x-4 gap-y-2")}>
      {options.map(opt => {
        const val = typeof opt === "string" ? opt : opt.value;
        const lbl = typeof opt === "string" ? opt : opt.label;
        const checked = value === val;
        return (
          <label key={val} className="flex items-start gap-2.5 cursor-pointer group">
            <div className={cn(
              "mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
              checked ? "border-primary bg-primary" : "border-border group-hover:border-primary/50"
            )}>
              {checked && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
            </div>
            <span className={cn("text-sm leading-snug", checked ? "text-foreground font-medium" : "text-muted-foreground")}>{lbl}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── CheckboxGroup ───────────────────────────────────────────────────────────
export function CheckboxGroup({ values = [], onChange, options = [], cols = 1 }) {
  const toggle = (val) => {
    if (values.includes(val)) onChange?.(values.filter(v => v !== val));
    else onChange?.([...values, val]);
  };

  return (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
      {options.map(opt => {
        const val = typeof opt === "string" ? opt : opt.value;
        const lbl = typeof opt === "string" ? opt : opt.label;
        const checked = values.includes(val);
        return (
          <label key={val} className="flex items-start gap-2.5 cursor-pointer group">
            <div
              onClick={() => toggle(val)}
              className={cn(
                "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                checked ? "border-primary bg-primary" : "border-border group-hover:border-primary/50"
              )}
            >
              {checked && <CheckCircle2 size={10} className="text-primary-foreground" />}
            </div>
            <span className={cn("text-sm leading-snug", checked ? "text-foreground font-medium" : "text-muted-foreground")}>{lbl}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── ActivityRow: card-row per piano attività (pattern ricorrente) ───────────
export const STATO_ROW_CLASS = {
  completata:   "border-green-500/30 bg-green-500/5",
  in_corso:     "border-amber-500/30 bg-amber-500/5",
  non_iniziata: "border-border bg-transparent",
};

export const STATO_SELECT_CLASS = {
  completata:   "text-green-700 dark:text-green-400 bg-green-500/10 border-green-500/30",
  in_corso:     "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  non_iniziata: "text-muted-foreground bg-muted/50 border-border",
};

// ─── Cell input/select (inline, dentro card-row) ─────────────────────────────
const cellBase = "border border-border rounded-md bg-background text-foreground text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50 transition-colors";

export function CellInput({ value, onChange, placeholder, type = "text", className }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(cellBase, className)}
    />
  );
}

export function CellSelect({ value, onChange, options = [], className }) {
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      className={cn(cellBase, "cursor-pointer", className)}
    >
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
  );
}

// ─── TableRow status helpers (per tabelle nei form) ──────────────────────────
export function rowStatusClass(val) {
  if (val === "no") return "bg-destructive/5 border-l-2 border-l-destructive";
  if (val === "condizionato" || val === "anomalia") return "bg-amber-500/5 border-l-2 border-l-amber-500";
  return "";
}

export function StatusPill({ value }) {
  const map = {
    sì:           "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
    validato:     "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
    ok:           "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
    no:           "bg-destructive/10 text-destructive border-destructive/30",
    anomalia:     "bg-destructive/10 text-destructive border-destructive/30",
    condizionato: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    da_validare:  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    "N/A":        "bg-muted text-muted-foreground border-border",
    parziale:     "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  };
  const cls = map[value] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold", cls)}>
      {value}
    </span>
  );
}

// ─── InlineInput / InlineSelect (per celle di tabella) ───────────────────────
export function InlineInput({ value, onChange, placeholder, type = "text", className }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent border-0 border-b border-border/60 px-1 py-0.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors",
        className
      )}
    />
  );
}

export function InlineSelect({ value, onChange, options = [], className }) {
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      className={cn(
        "bg-transparent border border-border rounded px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
        className
      )}
    >
      {options.map(o => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
  );
}