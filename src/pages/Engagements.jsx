import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressRing from "@/components/common/ProgressRing";
import DataGuard from "@/components/common/DataGuard";
import NuovoEngagementDialog from "@/components/engagement/NuovoEngagementDialog";
import { useEngagements } from "@/hooks/useEngagements";

const STATI    = ["Tutti", "MATERIALITA_IN_CORSO", "DATI_VALIDAZIONE", "BIL_PUBBLICATO", "CONTRATTO_FIRMATO"];
const STANDARD = ["Tutti", "GRI", "CSRD_ESRS", "ENTRAMBI"];

export default function Engagements() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statoFilter, setStatoFilter] = useState("Tutti");
  const [annoFilter, setAnnoFilter] = useState("Tutti");
  const [standardFilter, setStandardFilter] = useState("Tutti");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: engagements = [], isLoading, error } = useEngagements();

  const anni = ["Tutti", ...Array.from(new Set(engagements.map(e => String(e.anno_rendicontazione)))).sort().reverse()];

  const filtered = engagements.filter(e => {
    const matchSearch =
      (e.codice_progetto ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.clienti?.ragione_sociale ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStato    = statoFilter === "Tutti" || e.stato === statoFilter;
    const matchAnno     = annoFilter === "Tutti" || String(e.anno_rendicontazione) === annoFilter;
    const matchStandard = standardFilter === "Tutti" || e.standard === standardFilter;
    return matchSearch && matchStato && matchAnno && matchStandard;
  });

  const attivi = engagements.filter(e => e.stato !== "BIL_PUBBLICATO").length;

  return (
    <DataGuard data={engagements} isLoading={isLoading} error={error}>
      <div>
        <PageHeader
          title="Engagement"
          breadcrumbs={[{ label: "Engagement" }]}
          subtitle={`${engagements.length} engagement totali · ${attivi} attivi`}
          actions={
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Nuovo engagement
            </button>
          }
        />

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca project code o cliente…"
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={statoFilter} onChange={e => setStatoFilter(e.target.value)}>
            {STATI.map(s => <option key={s} value={s}>{s === "Tutti" ? "Tutti gli stati" : s.replace(/_/g, " ")}</option>)}
          </select>
          <select className="border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={annoFilter} onChange={e => setAnnoFilter(e.target.value)}>
            {anni.map(a => <option key={a} value={a}>{a === "Tutti" ? "Tutti gli anni" : a}</option>)}
          </select>
          <select className="border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={standardFilter} onChange={e => setStandardFilter(e.target.value)}>
            {STANDARD.map(s => <option key={s} value={s}>{s === "Tutti" ? "Tutti gli standard" : s}</option>)}
          </select>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Project code", "Cliente", "Anno", "Standard", "Stato", "Progresso", "Avvio", "Chiusura prev.", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(eng => (
                <tr key={eng.id} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/engagements/${eng.id}`)}>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{eng.codice_progetto}</span>
                  </td>
                  <td className="px-5 py-3 font-medium">{eng.clienti?.ragione_sociale ?? "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{eng.anno_rendicontazione}</td>
                  <td className="px-5 py-3"><StatusBadge status={eng.standard} /></td>
                  <td className="px-5 py-3"><StatusBadge status={eng.stato} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressRing value={eng.progresso ?? 0} size={32} strokeWidth={3} />
                      <span className="text-xs text-muted-foreground">{eng.progresso ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{eng.data_avvio ?? "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{eng.data_fine_prevista ?? "—"}</td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors" onClick={e => { e.stopPropagation(); navigate(`/engagements/${eng.id}`); }}>
                      <Eye size={15} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nessun engagement trovato con i filtri selezionati
            </div>
          )}
        </div>

        <NuovoEngagementDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      </div>
    </DataGuard>
  );
}
