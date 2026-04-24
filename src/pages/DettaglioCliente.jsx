import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Mail, Phone, ArrowRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressRing from "@/components/common/ProgressRing";
import { cn } from "@/lib/utils";
import DataGuard from "@/components/common/DataGuard";

// TODO: Replace with Supabase hook
const clienti = [];
const engagements = [];

const TABS = ["Anagrafica", "Engagement", "Contatti", "Documenti", "Storico attività"];

export default function DettaglioCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Anagrafica");

  const cliente = clienti.find(c => c.id === id);
  const engCliente = engagements.filter(e => e.cliente_id === id);

  if (!cliente) return <DataGuard data={null} />;

  return (
    <div>
      <PageHeader
        title={cliente.ragione_sociale}
        breadcrumbs={[{ label: "Clienti", to: "/clienti" }, { label: cliente.ragione_sociale }]}
        actions={
          <>
            <button className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors">
              Modifica
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Nuovo engagement
            </button>
          </>
        }
      />

      {/* Tab */}
      <div className="flex border-b border-border mb-6 gap-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Anagrafica */}
      {tab === "Anagrafica" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Identificazione</h3>
            <dl className="space-y-3">
              {[
                { label: "Ragione sociale", value: cliente.ragione_sociale, bold: true },
                { label: "P.IVA", value: cliente.piva, mono: true },
                { label: "Codice fiscale", value: cliente.codice_fiscale, mono: true },
                { label: "Codice ATECO", value: cliente.ateco, mono: true },
                { label: "Settore", value: cliente.settore },
                { label: "Quotato", value: cliente.quotato },
                { label: "Gruppo", value: cliente.gruppo || "—" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-baseline gap-4">
                  <dt className="text-xs text-muted-foreground shrink-0">{item.label}</dt>
                  <dd className={cn("text-sm text-right", item.bold && "font-semibold", item.mono && "font-mono")}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Dimensione e sede</h3>
            <dl className="space-y-3">
              {[
                { label: "Dipendenti", value: `${cliente.dipendenti} FTE` },
                { label: "Fatturato", value: `${cliente.fatturato}M€` },
                { label: "Sede legale", value: cliente.sede_legale },
                { label: "Sito web", value: cliente.sito_web },
                { label: "PEC", value: cliente.pec },
                { label: "Aggiunto il", value: cliente.creato_il },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-baseline gap-4">
                  <dt className="text-xs text-muted-foreground shrink-0">{item.label}</dt>
                  <dd className="text-sm text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Engagement */}
      {tab === "Engagement" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Project code", "Anno", "Standard", "Stato", "Progresso", "Azioni"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {engCliente.map(eng => (
                <tr key={eng.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/engagements/${eng.id}`)}>
                  <td className="px-5 py-3"><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{eng.project_code}</span></td>
                  <td className="px-5 py-3">{eng.anno}</td>
                  <td className="px-5 py-3"><StatusBadge status={eng.standard} /></td>
                  <td className="px-5 py-3"><StatusBadge status={eng.stato} /></td>
                  <td className="px-5 py-3"><ProgressRing value={eng.progress} size={32} strokeWidth={3} /></td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={e => { e.stopPropagation(); navigate(`/engagements/${eng.id}`); }}>
                      Apri <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contatti */}
      {tab === "Contatti" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cliente.contatti.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {c.nome.split(" ").map(p => p[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.nome}</p>
                  <p className="text-xs text-muted-foreground">{c.ruolo}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={12} /> <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={12} /> <span>{c.telefono}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground">Autonomia:</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-xs font-medium",
                    c.autonomia === "Alta" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  )}>{c.autonomia}</span>
                </div>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Plus size={20} />
            <span className="text-sm font-medium">Aggiungi contatto</span>
          </button>
        </div>
      )}

      {tab === "Documenti" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">Nessun documento caricato</p>
          <p className="text-xs text-muted-foreground">I documenti vengono caricati all'interno degli engagement</p>
        </div>
      )}

      {tab === "Storico attività" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            {[
              { data: "15 gen 2025", azione: "Engagement ESG-2025-ACM-001 avviato" },
              { data: "20 gen 2025", azione: "Kickoff meeting con il team cliente" },
              { data: "01 feb 2025", azione: "Contratto firmato — €25.000 netti" },
              { data: "10 feb 2025", azione: "Avvio materialità — questionari distribuiti" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm">{item.azione}</p>
                  <p className="text-xs text-muted-foreground">{item.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}