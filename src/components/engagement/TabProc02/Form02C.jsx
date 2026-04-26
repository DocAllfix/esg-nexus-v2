import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { useFormData, useFormDataReadonly } from "@/hooks/useFormData";
import { useIroEngagement } from "@/hooks/useIroEngagement";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from "recharts";
import { cn } from "@/lib/utils";

const AREA_COLORS_DOT = { E: "#10B981", S: "#6366F1", G: "#8B5CF6" };
const CAT_BADGE = {
  DOPPIA:           "bg-teal-100 text-teal-800 border-teal-200",
  SOLO_IMPATTO:     "bg-blue-100 text-blue-800 border-blue-200",
  SOLO_FINANZIARIA: "bg-purple-100 text-purple-800 border-purple-200",
  NON_MATERIALE:    "bg-gray-100 text-gray-500 border-gray-200",
};

function categorizza(iro, sogliaImpatto, sogliaFin) {
  const imp = iro.materialita_impatto ?? 0;
  const fin = iro.materialita_finanziaria ?? 0;
  if (imp >= sogliaImpatto && fin >= sogliaFin) return "DOPPIA";
  if (imp >= sogliaImpatto) return "SOLO_IMPATTO";
  if (fin >= sogliaFin) return "SOLO_FINANZIARIA";
  return "NON_MATERIALE";
}

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const color = AREA_COLORS_DOT[payload.area] || "#999";
  const r = payload.categoria === "DOPPIA" ? 8 : 6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.8} stroke="white" strokeWidth={1.5} />
      <text x={cx + 10} y={cy + 4} fontSize={9} fill="#666">{payload.codice}</text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-bold">{d.codice} — {d.tema}</p>
      <p>Area: <span className="font-medium">{d.area}</span> | Tipo: <span className="font-medium">{d.tipo}</span></p>
      <p>Score Impatto: <span className="font-bold">{(d.materialita_impatto ?? 0).toFixed(1)}</span></p>
      <p>Score Finanziario: <span className="font-bold">{(d.materialita_finanziaria ?? 0).toFixed(1)}</span></p>
      <p>Categoria: <span className="font-bold">{d.categoria?.replace("_", " ")}</span></p>
    </div>
  );
};

export default function Form02C({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "02C");
  const soglie = useFormDataReadonly(engagementId, "02B");
  const { data: iros = [] } = useIroEngagement(engagementId);
  const [sortBy, setSortBy] = useState("materialita_impatto");

  // Soglie vengono da Form02B — sola lettura in questo form
  const soglia_impatto = soglie?.soglia_impatto ?? 3.0;
  const soglia_fin     = soglie?.soglia_fin ?? 8.0;

  const irosCalcolati = iros.map(iro => ({
    ...iro,
    categoria: categorizza(iro, soglia_impatto, soglia_fin),
  }));

  const sorted = [...irosCalcolati].sort((a, b) =>
    ((b[sortBy] ?? 0)) - ((a[sortBy] ?? 0))
  );

  return (
    <FormWrapper
      formCode="FORM-02C"
      title="Matrice di Materialità"
      subtitle="Visualizzazione e validazione dei temi materiali identificati"
      meta={{ "Fase": "PROC-02.3", "Resp.": "Consulente Senior + Partner", "Standard": "ESRS 1 / GRI 3-2", "Output": "Matrice approvata dal CdA" }}
      ruleBox="📊 La matrice riflette gli IRO e le soglie configurati in FORM-02B. Deve essere presentata al CdA per approvazione formale."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      {/* Soglie in sola lettura — vengono da 02B */}
      <div className="flex items-center gap-6 px-4 py-3 bg-muted/30 rounded-lg border border-border text-xs text-muted-foreground">
        <span>Soglie impostate in FORM-02B:</span>
        <span>Impatto ≥ <strong className="text-foreground">{soglia_impatto}</strong></span>
        <span>Finanziaria ≥ <strong className="text-foreground">{soglia_fin}</strong></span>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 items-center">
        {[["E", "#10B981", "Ambiente"], ["S", "#6366F1", "Sociale"], ["G", "#8B5CF6", "Governance"]].map(([k, c, l]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: c }} />
            <span className="text-xs">{l}</span>
          </div>
        ))}
        <div className="ml-4 flex gap-2 flex-wrap">
          {Object.entries(CAT_BADGE).map(([k, v]) => (
            <span key={k} className={cn("text-xs px-2 py-0.5 rounded-full border", v)}>
              {k.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>

      {/* Matrice scatter */}
      <FormSection title="Matrice di materialità — Score Impatto × Score Finanziario" cols={1}>
        {iros.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Nessun IRO disponibile. Aggiungere gli IRO in FORM-02B.
          </p>
        ) : (
          <>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="materialita_impatto" domain={[0, 5.5]} name="Impatto">
                    <Label value="Score Impatto →" offset={-10} position="insideBottom"
                      style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  </XAxis>
                  <YAxis type="number" dataKey="materialita_finanziaria" domain={[0, 22]} name="Finanziario">
                    <Label value="Score Finanziario →" angle={-90} position="insideLeft"
                      style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  </YAxis>
                  <ReferenceLine x={soglia_impatto} stroke="hsl(var(--primary))" strokeDasharray="6 3" strokeWidth={1.5} />
                  <ReferenceLine y={soglia_fin} stroke="hsl(var(--primary))" strokeDasharray="6 3" strokeWidth={1.5} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={irosCalcolati} shape={<CustomDot />} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Le linee tratteggiate rappresentano le soglie di materialità. Quadrante in alto a destra = Doppia materialità.
            </p>
          </>
        )}
      </FormSection>

      {/* Elenco IRO */}
      <FormSection title="Elenco IRO materiali" cols={1}>
        <div className="flex gap-2 mb-3">
          <span className="text-xs text-muted-foreground">Ordina per:</span>
          {[["materialita_impatto", "Impatto"], ["materialita_finanziaria", "Finanziario"]].map(([k, l]) => (
            <button key={k} onClick={() => setSortBy(k)}
              className={cn("text-xs px-2 py-0.5 rounded border transition-colors",
                sortBy === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>
              {l}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2">Codice</th>
                <th className="text-left px-3 py-2">Tema</th>
                <th className="px-3 py-2 text-center">Area</th>
                <th className="px-3 py-2 text-center">Tipo</th>
                <th className="px-3 py-2 text-center">Impatto</th>
                <th className="px-3 py-2 text-center">Finanziario</th>
                <th className="px-3 py-2 text-center">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Nessun IRO. Aggiungerne in FORM-02B.</td></tr>
              ) : sorted.map(iro => (
                <tr key={iro.id} className={cn("border-t border-border hover:bg-muted/20", iro.categoria === "NON_MATERIALE" && "opacity-50")}>
                  <td className="px-3 py-2 font-mono font-bold">{iro.codice}</td>
                  <td className="px-3 py-2 font-medium">{iro.tema}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: AREA_COLORS_DOT[iro.area] }}>{iro.area}</span>
                  </td>
                  <td className="px-3 py-2 text-center">{iro.tipo}</td>
                  <td className="px-3 py-2 text-center font-bold">{(iro.materialita_impatto ?? 0).toFixed(1)}</td>
                  <td className="px-3 py-2 text-center font-bold">{(iro.materialita_finanziaria ?? 0).toFixed(1)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", CAT_BADGE[iro.categoria])}>
                      {iro.categoria?.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Commento analitico" cols={1}>
        <Field label="Sintesi e motivazione dei risultati della matrice">
          <Textarea value={d?.note_analitiche} onChange={v => updateField("note_analitiche", v)} rows={4}
            placeholder="Descrivere i criteri metodologici adottati e la motivazione delle soglie..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
