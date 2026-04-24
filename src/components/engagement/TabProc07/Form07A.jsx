import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_07A";

const CHECKLIST_DOSSIER = [
  { id: 1, voce: "Bilancio di sostenibilità FY2024 (PDF hi-res + web)", critico: true },
  { id: 2, voce: "Content Index GRI/ESRS completo", critico: true },
  { id: 3, voce: "Relazione di assurance limited (Deloitte)", critico: true },
  { id: 4, voce: "Dataset GHG validato (Scope 1, 2, 3) con note metodologiche", critico: true },
  { id: 5, voce: "Report KPI ESG completo (E, S, G) con serie storica", critico: true },
  { id: 6, voce: "Matrice di materialità (IRO assessment ESRS)", critico: true },
  { id: 7, voce: "Gap Analysis completa con stato gap", critico: false },
  { id: 8, voce: "Piano di azione ESG 2025-2028 approvato dal CdA", critico: false },
  { id: 9, voce: "Verbali riunioni chiave (kickoff, CdA ESG, workshop materialità)", critico: false },
  { id: 10, voce: "Registro rischi di progetto aggiornato", critico: false },
  { id: 11, voce: "Sorgenti dati (file Excel/CSV originali con catena di custodia)", critico: false },
  { id: 12, voce: "Documentazione fotografica / evidence raccolta dati", critico: false },
];

const DOCUMENTI_OUTPUT = [
  { nome: "Bilancio sostenibilità FY2024 — hi-res", tipo: "PDF", dim: "15,2 MB", stato: "finale" },
  { nome: "Bilancio sostenibilità FY2024 — web", tipo: "PDF", dim: "3,4 MB", stato: "finale" },
  { nome: "Content Index GRI/ESRS", tipo: "XLSX", dim: "280 KB", stato: "finale" },
  { nome: "Dataset GHG Scope 1-2-3", tipo: "XLSX", dim: "540 KB", stato: "finale" },
  { nome: "Report KPI ESG completo", tipo: "XLSX", dim: "410 KB", stato: "finale" },
  { nome: "Piano di azione ESG 2025-2028", tipo: "PDF", dim: "4,1 MB", stato: "finale" },
  { nome: "Matrice materialità IRO", tipo: "PDF", dim: "1,2 MB", stato: "finale" },
  { nome: "Relazione assurance Deloitte", tipo: "PDF", dim: "620 KB", stato: "finale" },
];

export default function Form07A() {
  const [checks, setChecks] = useState(CHECKLIST_DOSSIER.map((c, i) => ({ ...c, ok: i < 6 })));
  const [url_cartella, setUrlCartella] = useState("https://drive.google.com/drive/acme-esg-2025-dossier-finale");
  const [note, setNote] = useState("Il dossier finale è accessibile tramite SharePoint aziendale (cartella: ESG/Acme_2025/Dossier_Finale). Accesso limitato a: Partner ESG, referenti cliente (L. Rossi, M. Bianchi), ente di assurance. Retention documentale: 10 anni.");

  const toggle = (id) => setChecks(p => p.map(c => c.id === id ? { ...c, ok: !c.ok } : c));
  const critiche = checks.filter(c => c.critico);
  const critiOk = critiche.filter(c => c.ok).length;
  const tutteOk = critiOk === critiche.length;

  return (
    <FormWrapper
      formCode="FORM-07A"
      title="Report Finale e Dossier di Chiusura"
      subtitle="Raccolta e validazione di tutti i deliverable del progetto"
      meta={{ "Output": `${critiOk}/${critiche.length} doc critici`, "Cartella": "SharePoint / Drive" }}
      ruleBox={tutteOk ? "✅ Dossier completo — tutti i documenti critici presenti." : "⚠️ Completare i documenti critici prima di procedere alla chiusura formale."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* STATO */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
          <p className={cn("text-2xl font-bold", tutteOk ? "text-green-700" : "text-amber-600")}>{critiOk}/{critiche.length}</p>
          <p className="text-xs text-muted-foreground">Doc critici presenti</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
          <p className="text-2xl font-bold text-foreground">{checks.filter(c => c.ok).length}/{checks.length}</p>
          <p className="text-xs text-muted-foreground">Totale documenti</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
          <p className="text-2xl font-bold text-primary">{DOCUMENTI_OUTPUT.length}</p>
          <p className="text-xs text-muted-foreground">File output generati</p>
        </div>
      </div>

      <FormSection title="Checklist dossier" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} onClick={() => toggle(c.id)} className={cn("rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10", c.ok ? "border-green-200 bg-green-50/20" : "border-border")}>
              {c.ok ? <CheckCircle2 size={15} className="text-green-600 shrink-0" /> : <Circle size={15} className="text-muted-foreground shrink-0" />}
              <span className="text-sm flex-1">{c.voce}</span>
              {c.critico && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded shrink-0">critico</span>}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="File output del progetto" cols={1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DOCUMENTI_OUTPUT.map((d, i) => (
            <div key={i} className="flex items-center gap-3 border border-border rounded-lg p-3 hover:bg-muted/10">
              <FileText size={18} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{d.nome}</p>
                <p className="text-xs text-muted-foreground">{d.tipo} · {d.dim}</p>
              </div>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
                <Download size={11} /> Scarica
              </button>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Archiviazione">
        <Field label="URL cartella condivisa" span={2}>
          <Input value={url_cartella} onChange={setUrlCartella} placeholder="https://..." />
        </Field>
        <Field label="Note di archiviazione e retention" span={2}>
          <Textarea value={note} onChange={setNote} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}