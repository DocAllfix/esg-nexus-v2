import { useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NuovoClienteDrawer({ open, onClose }) {
  const [form, setForm] = useState({
    ragione_sociale: "", piva: "", codice_fiscale: "", ateco: "", settore: "",
    dipendenti: "", fatturato: "", sede_legale: "", sito_web: "", pec: "", quotato: "", gruppo: ""
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const pivaValida = form.piva.length === 11 && /^\d+$/.test(form.piva);
  const cfValido = form.codice_fiscale.length === 16;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border z-50 flex flex-col animate-slide-in-right shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Nuovo cliente</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Sezione 1 */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Identificazione</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Ragione sociale *</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.ragione_sociale} onChange={e => set("ragione_sociale", e.target.value)} placeholder="Es. Acme Manufacturing S.p.A." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">P.IVA *</label>
                <div className="relative">
                  <input type="text" maxLength={11} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-8 font-mono" value={form.piva} onChange={e => set("piva", e.target.value)} placeholder="01234567890" />
                  {form.piva && (
                    <span className="absolute right-2 top-2">
                      {pivaValida ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Codice fiscale</label>
                <div className="relative">
                  <input type="text" maxLength={16} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-8 font-mono uppercase" value={form.codice_fiscale} onChange={e => set("codice_fiscale", e.target.value)} placeholder="AAAAAA00A00A000A" />
                  {form.codice_fiscale && (
                    <span className="absolute right-2 top-2">
                      {cfValido ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Codice ATECO</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.ateco} onChange={e => set("ateco", e.target.value)} placeholder="Es. 29.10" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Settore</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card" value={form.settore} onChange={e => set("settore", e.target.value)}>
                  <option value="">Seleziona settore</option>
                  {["Automotive", "Agroalimentare", "Chimica", "Manifatturiero", "Energia", "Servizi", "ICT", "Costruzioni", "Farmaceutico", "Altro"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Sezione 2 */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Dimensione</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Dipendenti (n.)</label>
                <input type="number" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.dipendenti} onChange={e => set("dipendenti", e.target.value)} placeholder="250" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fatturato (M€)</label>
                <input type="number" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.fatturato} onChange={e => set("fatturato", e.target.value)} placeholder="45" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Sede legale</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.sede_legale} onChange={e => set("sede_legale", e.target.value)} placeholder="Via Roma 1, 20121 Milano MI" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sito web</label>
                <input type="url" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.sito_web} onChange={e => set("sito_web", e.target.value)} placeholder="https://www.azienda.it" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">PEC</label>
                <input type="email" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.pec} onChange={e => set("pec", e.target.value)} placeholder="azienda@pec.it" />
              </div>
            </div>
          </section>

          {/* Sezione 3 */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Struttura societaria</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Quotato</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-card" value={form.quotato} onChange={e => set("quotato", e.target.value)}>
                  <option value="">Seleziona</option>
                  <option>Sì</option>
                  <option>No</option>
                  <option>Partecipata pubblica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Gruppo di appartenenza</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.gruppo} onChange={e => set("gruppo", e.target.value)} placeholder="Es. Acme Group" />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors">
            Annulla
          </button>
          <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 transition-colors">
            Salva e crea engagement
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Salva
          </button>
        </div>
      </div>
    </>
  );
}