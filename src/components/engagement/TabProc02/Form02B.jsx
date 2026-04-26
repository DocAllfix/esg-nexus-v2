import { useState, useRef, useCallback } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { useIroEngagement, useAddIroFromCatalog, useUpdateIroScore, useDeleteIro } from "@/hooks/useIroEngagement";
import { useCatalogoIro } from "@/hooks/useCataloghi";
import { cn } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const AREE = ["E", "S", "G"];
const AREA_LABELS = { E: "Ambiente", S: "Sociale", G: "Governance" };
const TIPO_COLORS = {
  "Impatto":     "bg-red-100 text-red-800",
  "Rischio":     "bg-orange-100 text-orange-800",
  "Opportunità": "bg-blue-100 text-blue-800",
};
const CAT_COLORS = {
  DOPPIA:           "bg-teal-100 text-teal-800",
  SOLO_IMPATTO:     "bg-blue-100 text-blue-800",
  SOLO_FINANZIARIA: "bg-purple-100 text-purple-800",
  NON_MATERIALE:    "bg-gray-100 text-gray-500",
};

function categorizza(iro, sogliaImpatto, sogliaFin) {
  const imp = iro.materialita_impatto ?? 0;
  const fin = iro.materialita_finanziaria ?? 0;
  if (imp >= sogliaImpatto && fin >= sogliaFin) return "DOPPIA";
  if (imp >= sogliaImpatto) return "SOLO_IMPATTO";
  if (fin >= sogliaFin) return "SOLO_FINANZIARIA";
  return "NON_MATERIALE";
}

export default function Form02B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "02B");
  const { data: iros = [], isLoading: irosLoading } = useIroEngagement(engagementId);
  const { data: catalogo = [] } = useCatalogoIro();
  const { mutate: addFromCatalog, isPending: isAdding } = useAddIroFromCatalog(engagementId);
  const { mutate: updateScore } = useUpdateIroScore(engagementId);
  const { mutate: deleteIro } = useDeleteIro(engagementId);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const debounceTimers = useRef({});

  const soglia_impatto = d?.soglia_impatto ?? 3.0;
  const soglia_fin = d?.soglia_fin ?? 8.0;

  const irosCalcolati = iros.map(iro => ({
    ...iro,
    categoria: categorizza(iro, soglia_impatto, soglia_fin),
  }));

  const materiali = irosCalcolati.filter(i => i.categoria !== "NON_MATERIALE").length;
  const doppia    = irosCalcolati.filter(i => i.categoria === "DOPPIA").length;

  const existingIds = new Set(iros.map(i => i.catalogo_iro_id).filter(Boolean));
  const catalogoDisponibile = catalogo.filter(c => !existingIds.has(c.id));

  const handleScoreChange = useCallback((iroId, field, value) => {
    const key = `${iroId}-${field}`;
    clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(() => {
      updateScore({ id: iroId, field, value: value === "" ? null : Number(value) });
    }, 800);
  }, [updateScore]);

  const handleAddFromCatalog = () => {
    const items = catalogo.filter(c => selected.includes(c.id));
    addFromCatalog(items, {
      onSuccess: () => { setSelected([]); setPickerOpen(false); },
    });
  };

  return (
    <FormWrapper
      formCode="FORM-02B"
      title="Valutazione IRO — Doppia Materialità"
      subtitle="Assessment Impatti, Rischi e Opportunità per prospettiva di impatto e finanziaria"
      meta={{ "Fase": "PROC-02.2", "Resp.": "Consulente Senior", "Standard": "ESRS 1 / GRI 3-2", "Output": "Lista IRO valutati con score" }}
      ruleBox="🎯 Doppia Materialità ESRS: valutare ogni IRO sia dalla prospettiva di IMPATTO (scala, scopo, irrimediabilità) che FINANZIARIA (probabilità, magnitudine). Le soglie configurate qui si applicano anche alla matrice in FORM-02C."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      {/* Soglie */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <div>
          <label className="text-xs font-medium block mb-1">
            Soglia materialità — Impatto (scala 1–5): <span className="font-bold text-primary">{soglia_impatto}</span>
          </label>
          <input type="range" min={1} max={5} step={0.1} value={soglia_impatto}
            onChange={e => updateField("soglia_impatto", Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">
            Soglia materialità — Finanziaria (scala 1–20): <span className="font-bold text-primary">{soglia_fin}</span>
          </label>
          <input type="range" min={1} max={20} step={0.5} value={soglia_fin}
            onChange={e => updateField("soglia_fin", Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>20</span></div>
        </div>
      </div>

      {/* Contatori */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "IRO totali",        value: iros.length,        color: "text-foreground" },
          { label: "Materiali totali",  value: materiali,          color: "text-primary" },
          { label: "Doppia materialità",value: doppia,             color: "text-teal-700" },
          { label: "Non materiali",     value: iros.length - materiali, color: "text-muted-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Picker catalogo */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setPickerOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
        >
          <span className="flex items-center gap-2"><Plus size={15} /> Aggiungi IRO da catalogo</span>
          {pickerOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {pickerOpen && (
          <div className="p-4 border-t border-border space-y-3">
            {catalogoDisponibile.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                {catalogo.length === 0
                  ? "Il catalogo IRO è vuoto. Popolare la tabella catalogo_iro via migrazione SQL."
                  : "Tutti gli IRO del catalogo sono già stati aggiunti."}
              </p>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {["E", "S", "G"].map(area => {
                    const items = catalogoDisponibile.filter(c => c.area === area);
                    if (!items.length) return null;
                    return (
                      <div key={area}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 py-1">{AREA_LABELS[area]}</p>
                        {items.map(item => (
                          <label key={item.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected.includes(item.id)}
                              onChange={e => setSelected(prev =>
                                e.target.checked ? [...prev, item.id] : prev.filter(i => i !== item.id)
                              )}
                              className="accent-primary"
                            />
                            <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">{item.codice}</span>
                            <span className="text-xs flex-1">{item.tema}</span>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded shrink-0", TIPO_COLORS[item.tipo])}>{item.tipo}</span>
                          </label>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">{selected.length} selezionati</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected([]); setPickerOpen(false); }}
                      className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors">
                      Annulla
                    </button>
                    <button
                      onClick={handleAddFromCatalog}
                      disabled={!selected.length || isAdding}
                      className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                      {isAdding ? "Aggiunta…" : "Aggiungi selezionati"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tabelle per area */}
      {AREE.map(area => {
        const rows = irosCalcolati.filter(i => i.area === area);
        return (
          <FormSection key={area} title={`${area} — ${AREA_LABELS[area]}`} cols={1}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                    <th className="text-left px-3 py-2">Codice</th>
                    <th className="text-left px-3 py-2">Tema IRO</th>
                    <th className="px-3 py-2 text-center">Tipo</th>
                    <th className="px-3 py-2 text-center">Score Impatto</th>
                    <th className="px-3 py-2 text-center">Score Fin.</th>
                    <th className="px-3 py-2 text-center">Categoria</th>
                    <th className="px-3 py-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {irosLoading ? (
                    <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Caricamento…</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Nessun IRO per quest'area. Aggiungi dal catalogo.</td></tr>
                  ) : rows.map(iro => (
                    <tr key={iro.id} className={cn("border-t border-border hover:bg-muted/20", iro.categoria === "NON_MATERIALE" && "opacity-60")}>
                      <td className="px-3 py-2 font-mono font-bold">{iro.codice}</td>
                      <td className="px-3 py-2 font-medium">{iro.tema}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-medium", TIPO_COLORS[iro.tipo])}>{iro.tipo}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number" step={0.1} min={0} max={5}
                          defaultValue={iro.materialita_impatto ?? ""}
                          onChange={e => handleScoreChange(iro.id, "materialita_impatto", e.target.value)}
                          className={cn("w-16 text-center border rounded px-1 py-0.5 font-bold bg-background",
                            (iro.materialita_impatto ?? 0) >= soglia_impatto
                              ? "border-teal-400 bg-teal-50 text-teal-800"
                              : "border-border"
                          )}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number" step={0.1} min={0} max={20}
                          defaultValue={iro.materialita_finanziaria ?? ""}
                          onChange={e => handleScoreChange(iro.id, "materialita_finanziaria", e.target.value)}
                          className={cn("w-16 text-center border rounded px-1 py-0.5 font-bold bg-background",
                            (iro.materialita_finanziaria ?? 0) >= soglia_fin
                              ? "border-purple-400 bg-purple-50 text-purple-800"
                              : "border-border"
                          )}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", CAT_COLORS[iro.categoria])}>
                          {iro.categoria.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => deleteIro(iro.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Rimuovi IRO">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>
        );
      })}
    </FormWrapper>
  );
}
