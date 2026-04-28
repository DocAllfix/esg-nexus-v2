import { useFormData } from "@/hooks/useFormData";
import { atom } from "@/lib/bilancio/extractors";

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function StepIdentificazione({ engagementId, ctx, onNext, onBack }) {
  const { data: d, updateField } = useFormData(engagementId, "08A");

  const denomDefault = atom.ragioneSociale(ctx) ?? "";
  const annoDefault = ctx.engagement?.anno_rendicontazione ?? "";
  const codiceDefault = ctx.engagement?.codice_progetto ?? "";
  const periodoDefault = atom.periodoRendicontazione(ctx);
  const fwDefault = ctx.engagement?.standard ?? "ENTRAMBI";

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Identificazione del bilancio</h2>
          <p className="text-xs text-muted-foreground">
            Dati di copertina e metadati. Tutti i campi sono pre-compilati dall'engagement —
            modifica solo se necessario.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Codice bilancio">
            <input
              type="text"
              value={d?.codice_bilancio ?? codiceDefault}
              onChange={(e) => updateField("codice_bilancio", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="es. ESG-2024-ACME-001"
            />
          </Field>
          <Field label="Anno rendicontazione">
            <input
              type="number"
              value={d?.anno_rendicontazione ?? annoDefault}
              onChange={(e) => updateField("anno_rendicontazione", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>

        <Field label="Denominazione organizzazione">
          <input
            type="text"
            value={d?.denominazione ?? denomDefault}
            onChange={(e) => updateField("denominazione", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Periodo">
            <input
              type="text"
              value={d?.periodo ?? periodoDefault}
              onChange={(e) => updateField("periodo", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
          <Field label="Data pubblicazione">
            <input
              type="date"
              value={d?.data_pubblicazione ?? ""}
              onChange={(e) => updateField("data_pubblicazione", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Framework di rendicontazione" hint="Pre-impostato dall'engagement">
            <select
              value={d?.framework ?? fwDefault}
              onChange={(e) => updateField("framework", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="GRI">Solo GRI Standards</option>
              <option value="CSRD_ESRS">Solo ESRS / CSRD</option>
              <option value="ENTRAMBI">GRI + ESRS</option>
            </select>
          </Field>
          <Field label="Punto di contatto">
            <input
              type="text"
              value={d?.contatto ?? ""}
              onChange={(e) => updateField("contatto", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Sustainability Manager — sostenibilita@azienda.it"
            />
          </Field>
        </div>

        <Field label="Note di copertina">
          <textarea
            value={d?.note_copertina ?? ""}
            onChange={(e) => updateField("note_copertina", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Eventuali note aggiuntive da riportare in copertina"
          />
        </Field>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted"
        >
          ← Indietro
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Avanti: Indici GRI / ESRS →
        </button>
      </div>
    </div>
  );
}
