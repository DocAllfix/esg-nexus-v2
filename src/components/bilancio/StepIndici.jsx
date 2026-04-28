import { useState } from "react";
import { useFormData } from "@/hooks/useFormData";
import { GRI_DISCLOSURES, ESRS_DATAPOINTS } from "@/lib/bilancio/fieldMaps";
import { extractAllGri, extractAllEsrs } from "@/lib/bilancio/extractors";
import { cn } from "@/lib/utils";

function StatusBadge({ status }) {
  const cfg = {
    Override: "bg-teal-100 text-teal-800",
    Auto:     "bg-blue-100 text-blue-800",
    Mancante: "bg-gray-100 text-gray-500",
  }[status];
  return <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded uppercase", cfg)}>{status}</span>;
}

function IndexRow({ code, title, area, autoValue, override, onChange }) {
  const status = override ? "Override" : autoValue ? "Auto" : "Mancante";
  const display = autoValue == null ? "" : typeof autoValue === "object" ? JSON.stringify(autoValue).slice(0, 100) : String(autoValue).slice(0, 140);

  return (
    <div className="grid grid-cols-[100px_1fr_80px_1.2fr] gap-3 items-start py-2.5 border-b border-border last:border-b-0">
      <div className="font-mono text-xs font-semibold pt-1.5">{code}</div>
      <div className="pt-1">
        <div className="text-xs font-medium">{title}</div>
        {area && <div className="text-[10px] text-muted-foreground">{area}</div>}
      </div>
      <div className="pt-1.5"><StatusBadge status={status} /></div>
      <div>
        <textarea
          value={override ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={display || "Compila manualmente"}
          rows={2}
          className="w-full px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-vertical"
        />
        {autoValue && !override && (
          <div className="text-[10px] text-muted-foreground mt-1">
            Auto: <em>{display}</em>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepIndici({ engagementId, ctx, identificazione, onNext, onBack }) {
  const { data: gri, updateField: setGri } = useFormData(engagementId, "08C");
  const { data: esrs, updateField: setEsrs } = useFormData(engagementId, "08D");
  const [activeTab, setActiveTab] = useState("gri");

  const fw = identificazione.framework || ctx.engagement?.standard;
  const showGri = fw === "GRI" || fw === "ENTRAMBI";
  const showEsrs = fw === "CSRD_ESRS" || fw === "ENTRAMBI";

  const autoGri = extractAllGri(ctx);
  const autoEsrs = extractAllEsrs(ctx);

  const griCovered = GRI_DISCLOSURES.filter((g) => gri?.[g.code] || autoGri[g.code]).length;
  const esrsCovered = ESRS_DATAPOINTS.filter((e) => esrs?.[e.code] || autoEsrs[e.code]).length;

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-1">Indici GRI / ESRS</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Per ogni disclosure: il valore <strong>Auto</strong> viene estratto dai PROC.
          Puoi sovrascriverlo nella casella di destra (<strong>Override</strong>).
        </p>

        {/* Tab GRI/ESRS */}
        {showGri && showEsrs && (
          <div className="flex border-b border-border mb-4">
            <button
              onClick={() => setActiveTab("gri")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                activeTab === "gri" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              GRI ({griCovered}/{GRI_DISCLOSURES.length})
            </button>
            <button
              onClick={() => setActiveTab("esrs")}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                activeTab === "esrs" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              ESRS ({esrsCovered}/{ESRS_DATAPOINTS.length})
            </button>
          </div>
        )}

        {showGri && (activeTab === "gri" || !showEsrs) && (
          <div>
            <div className="grid grid-cols-[100px_1fr_80px_1.2fr] gap-3 px-1 py-2 border-b border-border bg-muted/40 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
              <div>Codice</div>
              <div>Disclosure</div>
              <div>Stato</div>
              <div>Valore / Override</div>
            </div>
            {GRI_DISCLOSURES.map((g) => (
              <IndexRow
                key={g.code}
                code={`GRI ${g.code}`}
                title={g.title}
                area={`Cap. ${g.chapter}`}
                autoValue={autoGri[g.code]}
                override={gri?.[g.code]}
                onChange={(v) => setGri(g.code, v.trim() ? v : undefined)}
              />
            ))}
          </div>
        )}

        {showEsrs && (activeTab === "esrs" || !showGri) && (
          <div>
            <div className="grid grid-cols-[100px_1fr_80px_1.2fr] gap-3 px-1 py-2 border-b border-border bg-muted/40 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
              <div>Codice</div>
              <div>Datapoint</div>
              <div>Stato</div>
              <div>Valore / Override</div>
            </div>
            {ESRS_DATAPOINTS.map((e) => (
              <IndexRow
                key={e.code}
                code={e.code}
                title={e.title}
                area={e.area}
                autoValue={autoEsrs[e.code]}
                override={esrs?.[e.code]}
                onChange={(v) => setEsrs(e.code, v.trim() ? v : undefined)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted">
          ← Indietro
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          Avanti: Capitoli →
        </button>
      </div>
    </div>
  );
}
