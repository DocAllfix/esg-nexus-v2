import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Building2, ExternalLink, Eye } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import NuovoClienteDrawer from "@/components/clienti/NuovoClienteDrawer";

// TODO: Replace with Supabase hook
const clienti = [];
const engagements = [];

const settoriColors = {
  "Automotive": "bg-blue-100 text-blue-800",
  "Agroalimentare": "bg-green-100 text-green-800",
  "Chimica": "bg-purple-100 text-purple-800",
};

export default function Clienti() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = clienti.filter(c =>
    c.ragione_sociale.toLowerCase().includes(search.toLowerCase()) ||
    c.settore.toLowerCase().includes(search.toLowerCase())
  );

  const getEngagementCount = (clienteId) =>
    engagements.filter(e => e.cliente_id === clienteId).length;

  return (
    <div>
      <PageHeader
        title="Clienti"
        breadcrumbs={[{ label: "Clienti" }]}
        subtitle={`${clienti.length} clienti nel portafoglio`}
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Nuovo cliente
          </button>
        }
      />

      {/* Filtri */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca per ragione sociale o settore…"
            className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Ragione sociale", "P.IVA", "Settore", "Dipendenti", "Fatturato", "Engagement", "Azioni"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(cliente => (
              <tr
                key={cliente.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/clienti/${cliente.id}`)}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-primary" />
                    </div>
                    <span className="font-medium hover:text-primary transition-colors">{cliente.ragione_sociale}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{cliente.piva}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${settoriColors[cliente.settore] || "bg-gray-100 text-gray-700"}`}>
                    {cliente.settore}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{cliente.dipendenti}</td>
                <td className="px-5 py-3 text-muted-foreground">{cliente.fatturato}M€</td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded font-medium">
                    {getEngagementCount(cliente.id)} engagement
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    onClick={e => { e.stopPropagation(); navigate(`/clienti/${cliente.id}`); }}
                    aria-label="Apri scheda cliente"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Building2 size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Nessun cliente trovato</p>
            <p className="text-xs text-muted-foreground">Prova a modificare i filtri di ricerca</p>
          </div>
        )}
      </div>

      <NuovoClienteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}