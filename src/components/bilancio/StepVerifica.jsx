import { CheckCircle2, AlertTriangle, XCircle, Database, Building2, Layers, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { atom } from "@/lib/bilancio/extractors";
import { computeWarnings } from "@/lib/bilancio/coverage";

function StatRow({ icon: Icon, label, value, ok }) {
  const Status = ok ? CheckCircle2 : XCircle;
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 border rounded-lg",
      ok ? "border-border bg-card" : "border-amber-300 bg-amber-50/40"
    )}>
      <Icon size={18} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm truncate">{value || "—"}</p>
      </div>
      <Status size={16} className={ok ? "text-green-600" : "text-amber-600"} />
    </div>
  );
}

export default function StepVerifica({ ctx, onNext }) {
  const ragione = atom.ragioneSociale(ctx);
  const settore = atom.settore(ctx);
  const head = atom.dipendenti(ctx);
  const visione = atom.visioneEsg(ctx);
  const iroCount = ctx.iro?.length ?? 0;
  const formCount = Object.keys(ctx.forms ?? {}).length;
  const scope1 = atom.scope1Total(ctx);
  const scope2 = atom.scope2MbTotal(ctx);

  const { warnings, coverage } = computeWarnings(ctx);
  const errors = warnings.filter((w) => w.severity === "error");
  const warns = warnings.filter((w) => w.severity === "warning");
  const infos = warnings.filter((w) => w.severity === "info");

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-1">Dati raccolti dall'engagement</h2>
        <p className="text-xs text-muted-foreground mb-4">
          ESG Nexus ha letto automaticamente questi dati dai PROC compilati.
          Verifica la copertura prima di procedere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatRow icon={Building2} label="Ragione sociale (PROC-00/01)" value={ragione} ok={!!ragione} />
          <StatRow icon={Building2} label="Settore" value={settore} ok={!!settore} />
          <StatRow icon={Database} label="Form compilati" value={`${formCount} form_data`} ok={formCount > 0} />
          <StatRow icon={Layers} label="IRO materiali (PROC-02)" value={`${iroCount} IRO`} ok={iroCount > 0} />
          <StatRow icon={Leaf} label="Headcount (PROC-04 KPI s01)" value={head} ok={!!head} />
          <StatRow icon={Leaf} label="GHG Scope 1 (PROC-04 Form04B)" value={scope1 ? `${scope1} tCO2e` : null} ok={!!scope1} />
          <StatRow icon={Leaf} label="GHG Scope 2 mb" value={scope2 ? `${scope2} tCO2e` : null} ok={!!scope2} />
          <StatRow icon={Building2} label="Vision ESG (PROC-05 Form05A)" value={visione?.slice(0, 80)} ok={!!visione} />
        </div>
      </div>

      {/* Copertura indici */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Copertura GRI</p>
          <p className="text-3xl font-bold tabular-nums">{coverage.gri}<span className="text-base text-muted-foreground">%</span></p>
          <p className="text-xs text-muted-foreground">{coverage.griCovered} / {coverage.griTotal} disclosure coperte</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${coverage.gri}%` }} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Copertura ESRS</p>
          <p className="text-3xl font-bold tabular-nums">{coverage.esrs}<span className="text-base text-muted-foreground">%</span></p>
          <p className="text-xs text-muted-foreground">{coverage.esrsCovered} / {coverage.esrsTotal} datapoint coperti</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${coverage.esrs}%` }} />
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(errors.length > 0 || warns.length > 0 || infos.length > 0) && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Note di copertura</h3>
          <div className="space-y-2">
            {errors.map((w) => (
              <div key={w.code} className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs">
                <XCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1"><strong>Cap. {w.chapter}:</strong> {w.message}</div>
              </div>
            ))}
            {warns.map((w) => (
              <div key={w.code} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1"><strong>Cap. {w.chapter}:</strong> {w.message}</div>
              </div>
            ))}
            {infos.map((w) => (
              <div key={w.code} className="flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1"><strong>Cap. {w.chapter}:</strong> {w.message}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Puoi proseguire comunque: i capitoli con dati mancanti verranno generati con placeholder.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Avanti: Identificazione →
        </button>
      </div>
    </div>
  );
}
