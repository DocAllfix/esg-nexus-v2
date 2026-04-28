import { useState } from "react";
import { useFormData } from "@/hooks/useFormData";
import { CHAPTERS } from "@/lib/bilancio/fieldMaps";
import { generateChapterDraft } from "@/lib/bilancio/chapters";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function StepCapitoli({ engagementId, ctx, identificazione, onNext, onBack }) {
  // 08E: include map { chId: bool }
  // 08F: chapter content { chId: { title, abstract, body } }
  const { data: include, updateField: setInclude } = useFormData(engagementId, "08E");
  const { data: cap, updateField: setCap } = useFormData(engagementId, "08F");

  const [activeId, setActiveId] = useState(CHAPTERS[0].id);

  const includesMap = include ?? {};
  const isIncluded = (id) => includesMap[id] !== false;
  const toggleInclude = (id) => setInclude(id, !isIncluded(id));

  const activeCh = CHAPTERS.find((c) => c.id === activeId);
  const activeData = cap?.[activeId] ?? {};
  const draft = generateChapterDraft(activeId, ctx, identificazione);

  const updateChField = (key, value) => {
    setCap(activeId, { ...activeData, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[280px_1fr] gap-4">
        {/* Sidebar capitoli */}
        <div className="bg-card border border-border rounded-lg overflow-hidden h-fit">
          <div className="px-3 py-2.5 border-b border-border bg-muted/30">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Indice ({CHAPTERS.filter((c) => isIncluded(c.id)).length}/{CHAPTERS.length})
            </p>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {CHAPTERS.map((c, i) => {
              const filled = !!(cap?.[c.id]?.body && cap[c.id].body.length > 30);
              const included = isIncluded(c.id);
              return (
                <div key={c.id} className="flex items-center gap-2 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={included}
                    onChange={() => toggleInclude(c.id)}
                    className="accent-primary"
                  />
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "flex-1 text-left text-xs truncate",
                      activeId === c.id && "font-semibold text-primary",
                      !included && "opacity-40 line-through",
                      filled && "text-foreground"
                    )}
                    disabled={!included}
                  >
                    {String(i + 1).padStart(2, "0")}. {c.title}
                  </button>
                  {filled && <span className="text-[9px] text-green-600">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor capitolo attivo */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">{activeCh?.title}</h2>
            <p className="text-xs text-muted-foreground">
              {activeId === "kpi" || activeId === "index"
                ? "Questo capitolo viene generato automaticamente come tabella, non richiede testo."
                : "Personalizza il testo, oppure usa la bozza auto-generata dai PROC."}
            </p>
          </div>

          {(activeId === "kpi" || activeId === "index") ? (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
              Questo capitolo è generato automaticamente nel formato finale dal motore di generazione.
              Vedrai la tabella nell'<strong>Anteprima</strong> (step 5).
            </div>
          ) : (
            <>
              {draft && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs flex-1">
                      <strong>Bozza suggerita</strong> dai dati raccolti nei PROC.
                    </p>
                    <button
                      onClick={() => updateChField("body", draft)}
                      className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 shrink-0"
                    >
                      Inserisci nel testo →
                    </button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap bg-white p-3 rounded border border-blue-100 max-h-40 overflow-y-auto font-sans leading-relaxed">
                    {draft}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Titolo capitolo
                </label>
                <input
                  type="text"
                  value={activeData.title ?? activeCh.title}
                  onChange={(e) => updateChField("title", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Abstract (opzionale)
                </label>
                <textarea
                  value={activeData.abstract ?? ""}
                  onChange={(e) => updateChField("abstract", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Frase introduttiva di 2-3 righe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Corpo del capitolo
                </label>
                <textarea
                  value={activeData.body ?? ""}
                  onChange={(e) => updateChField("body", e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  placeholder="Testo del capitolo. Placeholder disponibili: {{denominazione}}, {{anno_N}}, {{periodo}}, {{contatto}}"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Markdown leggero: <code>**bold**</code>, doppio newline = nuovo paragrafo, <code>- voce</code> = elenco.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted">
          ← Indietro
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          Avanti: Anteprima →
        </button>
      </div>
    </div>
  );
}
