import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05F";

const ANNI = ["2025", "2026", "2027", "2028+"];
const AREE = ["E", "S", "G"];
const AREA_COLORS = {
  E: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", dot: "bg-green-500" },
  S: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", dot: "bg-blue-500" },
  G: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", dot: "bg-purple-500" },
};
const STATI_COLORS = { "Completata": "bg-green-500", "In corso": "bg-amber-400", "Pianificata": "bg-gray-300", "Non avviata": "bg-gray-200" };

const ROADMAP_DATA = [
  { id: "INI-001", area: "E", titolo: "Fotovoltaico 800 kWp", anno_avvio: "2025", anno_fine: "2025", q_avvio: 1, q_fine: 3, stato: "In corso", milestone: "Collaudo impianto Q3 2025" },
  { id: "INI-002", area: "S", titolo: "Zero Harm H&S", anno_avvio: "2025", anno_fine: "2026", q_avvio: 1, q_fine: 4, stato: "In corso", milestone: "TRIR < 1.0 entro fine 2026" },
  { id: "INI-003", area: "G", titolo: "Whistleblowing e codice etico", anno_avvio: "2025", anno_fine: "2025", q_avvio: 2, q_fine: 2, stato: "In corso", milestone: "Piattaforma attiva Q2 2025" },
  { id: "INI-004", area: "S", titolo: "Audit ESG supply chain", anno_avvio: "2025", anno_fine: "2026", q_avvio: 2, q_fine: 2, stato: "In corso", milestone: "Top-20 fornitori certificati Q2 2026" },
  { id: "INI-005", area: "E", titolo: "Target SBTi + piano transizione", anno_avvio: "2025", anno_fine: "2026", q_avvio: 3, q_fine: 4, stato: "Pianificata", milestone: "Approvazione SBTi Q4 2026" },
  { id: "INI-006", area: "S", titolo: "Policy D&I e parità genere", anno_avvio: "2025", anno_fine: "2027", q_avvio: 2, q_fine: 4, stato: "In corso", milestone: "40% donne management 2028" },
  { id: "INI-007", area: "G", titolo: "Comitato ESG in CdA", anno_avvio: "2025", anno_fine: "2025", q_avvio: 1, q_fine: 3, stato: "In corso", milestone: "Prima riunione Q3 2025" },
  { id: "INI-008", area: "E", titolo: "Biodiversità ed economia circolare", anno_avvio: "2026", anno_fine: "2028+", q_avvio: 1, q_fine: 2, stato: "Pianificata", milestone: "Piano TNFD approvato 2026" },
];

const MILESTONES = [
  { data: "2025-Q2", titolo: "Whistleblowing operativo", ini: "INI-003", area: "G" },
  { data: "2025-Q3", titolo: "Fotovoltaico collaudato (+760 MWh/anno)", ini: "INI-001", area: "E" },
  { data: "2025-Q3", titolo: "Comitato ESG istituito", ini: "INI-007", area: "G" },
  { data: "2025-Q4", titolo: "Bilancio sostenibilità FY2024 pubblicato", ini: "—", area: "G" },
  { data: "2026-Q2", titolo: "Audit top-20 fornitori completato", ini: "INI-004", area: "S" },
  { data: "2026-Q4", titolo: "SBTi approvato — Target 1.5°C", ini: "INI-005", area: "E" },
  { data: "2027-Q4", titolo: "80% energia da rinnovabili", ini: "INI-001/005", area: "E" },
  { data: "2028+", titolo: "40% donne in management", ini: "INI-006", area: "S" },
];

export default function Form05F() {
  const [viewMode, setViewMode] = useState("roadmap");

  return (
    <FormWrapper
      formCode="FORM-05F"
      title="Roadmap Strategica ESG — 2025-2028+"
      subtitle="Timeline delle iniziative e milestone chiave per area E/S/G"
      meta={{ "Fase": "PROC-05.6", "Resp.": "Consulente Senior", "Output": "Roadmap presentata al CdA" }}
      ruleBox="🗓️ La roadmap visualizza l'orizzonte temporale di ogni iniziativa e le milestone chiave. Presentare al CdA per approvazione contestualmente al budget."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* TOGGLE VIEW */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[["roadmap", "Gantt / Roadmap"], ["milestones", "Milestone chiave"]].map(([k, l]) => (
          <button key={k} onClick={() => setViewMode(k)} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", viewMode === k ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {l}
          </button>
        ))}
      </div>

      {viewMode === "roadmap" && (
        <FormSection title="Timeline iniziative per area" cols={1}>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* HEADER ANNI / QUARTER */}
              <div className="flex mb-2">
                <div className="w-64 shrink-0" />
                <div className="flex-1 grid grid-cols-4 gap-0">
                  {ANNI.map(a => (
                    <div key={a} className="text-center border border-border bg-muted rounded px-2 py-1 mx-0.5">
                      <p className="text-xs font-bold">{a}</p>
                      <div className="flex justify-around text-xs text-muted-foreground mt-0.5">
                        {a !== "2028+" && ["Q1","Q2","Q3","Q4"].map(q => <span key={q}>{q}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* RIGHE INIZIATIVE */}
              {AREE.map(area => (
                <div key={area} className="mb-3">
                  <p className={cn("text-xs font-bold uppercase tracking-widest mb-1 px-1", AREA_COLORS[area].text)}>Area {area}</p>
                  {ROADMAP_DATA.filter(r => r.area === area).map(row => {
                    const ai = ANNI.indexOf(row.anno_avvio);
                    const af = ANNI.indexOf(row.anno_fine);
                    const startPct = ai >= 0 ? (ai / 4) + ((row.q_avvio - 1) / 16) : 0;
                    const endPct = af >= 0 ? (af / 4) + (row.q_fine / 16) : 1;
                    const widthPct = Math.max(endPct - startPct, 0.06);
                    return (
                      <div key={row.id} className="flex items-center mb-1.5">
                        <div className="w-64 shrink-0 pr-3">
                          <p className="text-xs font-medium truncate">{row.titolo}</p>
                          <p className="text-xs text-muted-foreground font-mono">{row.id}</p>
                        </div>
                        <div className="flex-1 relative h-7 bg-muted/30 rounded">
                          <div
                            className={cn("absolute top-1 bottom-1 rounded flex items-center px-2", AREA_COLORS[area].bg, AREA_COLORS[area].border, "border")}
                            style={{ left: `${startPct * 100}%`, width: `${widthPct * 100}%` }}
                          >
                            <span className={cn("text-xs font-medium truncate", AREA_COLORS[area].text)}>{row.stato}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      )}

      {viewMode === "milestones" && (
        <FormSection title="Milestone chiave" cols={1}>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {MILESTONES.map((m, i) => {
                const ac = AREA_COLORS[m.area];
                return (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={cn("absolute -left-4 w-4 h-4 rounded-full border-2 border-card mt-0.5", ac.dot)} />
                    <div className="flex-1 bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", ac.bg, ac.text)}>{m.area}</span>
                        <span className="text-xs font-mono text-muted-foreground font-bold">{m.data}</span>
                        <span className="text-xs text-muted-foreground">{m.ini}</span>
                      </div>
                      <p className="text-sm font-semibold">{m.titolo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FormSection>
      )}
    </FormWrapper>
  );
}