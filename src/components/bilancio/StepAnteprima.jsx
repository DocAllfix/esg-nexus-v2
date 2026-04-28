import { useFormData } from "@/hooks/useFormData";
import { CHAPTERS } from "@/lib/bilancio/fieldMaps";
import BilancioPreview from "./BilancioPreview";
import { Printer } from "lucide-react";

export default function StepAnteprima({ engagementId, ctx, identificazione, onNext, onBack }) {
  const { data: include } = useFormData(engagementId, "08E");
  const { data: chapterContent } = useFormData(engagementId, "08F");
  const { data: griOverrides } = useFormData(engagementId, "08C");
  const { data: esrsOverrides } = useFormData(engagementId, "08D");

  const includesMap = include ?? {};
  const capitoliInclusi = CHAPTERS
    .filter((c) => includesMap[c.id] !== false)
    .map((c) => c.id);

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Anteprima del bilancio</h2>
          <p className="text-xs text-muted-foreground">
            Documento finale come apparirà al cliente. Usa "Stampa" per ottenere il PDF.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted"
        >
          <Printer size={14} /> Stampa anteprima
        </button>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg overflow-x-auto">
        <BilancioPreview
          ctx={ctx}
          identificazione={identificazione}
          capitoliInclusi={capitoliInclusi}
          chapterOverrides={chapterContent ?? {}}
          overridesGri={griOverrides ?? {}}
          overridesEsrs={esrsOverrides ?? {}}
        />
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted">
          ← Indietro
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          Avanti: Genera →
        </button>
      </div>
    </div>
  );
}
