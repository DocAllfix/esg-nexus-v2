import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, FileText, Clock, AlertOctagon,
  CheckCircle2, AlertTriangle, Star, Database,
  Users, ArrowRight, TrendingUp, ChevronRight
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressRing from "@/components/common/ProgressRing";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const engagements = [];
const eventiRecenti = [];
const azioniOggi = [];

const iconMap = { CheckCircle2, AlertTriangle, Star, Database, Users, FileText, Clock };

// KPI summary cards
const KPI_CONFIG = [
  { label: "Engagement attivi", value: 3, sub: "+1 questo mese", icon: Briefcase, variant: "default" },
  { label: "Bilanci da chiudere", value: 1, sub: "Scadenza ottobre", icon: FileText, variant: "warning" },
  { label: "Azioni in scadenza", value: 4, sub: "di cui 2 oggi", icon: Clock, variant: "warning" },
  { label: "Rischi critici", value: 2, sub: "Richiedono attenzione", icon: AlertOctagon, variant: "danger" },
];

const variantStyles = {
  default: { card: "border-border", icon: "bg-primary/10 text-primary", value: "text-foreground" },
  warning: { card: "border-amber-500/30", icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400", value: "text-amber-600 dark:text-amber-400" },
  danger: { card: "border-destructive/30", icon: "bg-destructive/10 text-destructive", value: "text-destructive" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [azioni, setAzioni] = useState(azioniOggi);

  const completate = azioni.filter(a => a.completata).length;
  const toggleAzione = (id) => setAzioni(prev => prev.map(a => a.id === id ? { ...a, completata: !a.completata } : a));

  const engAttivi = engagements.filter(e => e.stato !== "BIL_PUBBLICATO");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Benvenuto, Ing. Fabbricini — riepilogo aggiornato al 24 aprile 2026"
      />

      {/* ── KPI Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CONFIG.map(k => {
          const s = variantStyles[k.variant];
          return (
            <div key={k.label} className={cn("bg-card border rounded-xl p-5 flex items-start gap-4", s.card)}>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", s.icon)}>
                <k.icon size={18} />
              </div>
              <div>
                <p className={cn("text-2xl font-bold tabular-nums leading-none", s.value)}>{k.value}</p>
                <p className="text-xs font-medium text-foreground mt-1">{k.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Engagement attivi (tabella centrale) ─────────────────────────── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Engagement attivi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{engAttivi.length} in corso · {engagements.length - engAttivi.length} chiusi</p>
          </div>
          <button onClick={() => navigate("/engagements")} className="flex items-center gap-1 text-xs text-primary hover:underline">
            Vedi tutti <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-border">
          {engagements.map(eng => (
            <div
              key={eng.id}
              onClick={() => navigate(`/engagements/${eng.id}`)}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors"
            >
              {/* Progress ring */}
              <ProgressRing value={eng.progress} size={36} strokeWidth={3} />

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded font-medium">{eng.project_code}</span>
                  <StatusBadge status={eng.stato} />
                </div>
                <p className="text-sm font-medium mt-0.5 truncate">{eng.cliente_nome}</p>
              </div>

              {/* Meta */}
              <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                <span>{eng.anno}</span>
                <span className="font-medium text-foreground">{eng.proc_corrente}</span>
                <StatusBadge status={eng.standard} />
              </div>

              <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Azioni oggi + Attività recente ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Azioni del giorno */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">La mia giornata</h2>
              <span className="text-xs text-muted-foreground">{completate}/{azioni.length} completate</span>
            </div>
            <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completate / azioni.length) * 100}%` }} />
            </div>
          </div>
          <div className="divide-y divide-border max-h-72 overflow-y-auto">
            {azioni.map(azione => (
              <div
                key={azione.id}
                onClick={() => toggleAzione(azione.id)}
                className={cn("flex items-center gap-3 px-5 py-3 hover:bg-muted/30 cursor-pointer transition-colors", azione.completata && "opacity-50")}
              >
                <div className={cn(
                  "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
                  azione.completata ? "bg-primary border-primary" : "border-border"
                )}>
                  {azione.completata && <CheckCircle2 size={9} className="text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-snug", azione.completata && "line-through text-muted-foreground")}>
                    {azione.titolo}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{azione.cliente} · {azione.scadenza}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attività recente */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Attività recente</h2>
          </div>
          <div className="px-5 py-3 space-y-3.5 max-h-72 overflow-y-auto">
            {eventiRecenti.slice(0, 7).map(ev => {
              const Icon = iconMap[ev.icona] || Clock;
              return (
                <div key={ev.id} className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    ev.tipo === "successo" ? "bg-green-500/10" : ev.tipo === "warning" ? "bg-amber-500/10" : "bg-muted"
                  )}>
                    <Icon size={12} className={
                      ev.tipo === "successo" ? "text-green-600 dark:text-green-400" : ev.tipo === "warning" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{ev.testo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.tempo} · <span className="font-mono">{ev.engagement}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}