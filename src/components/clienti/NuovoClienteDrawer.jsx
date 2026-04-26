import { useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { clienteSchema } from "@/schemas/index";
import { useToast } from "@/components/ui/use-toast";

export default function NuovoClienteDrawer({ open, onClose, onCreate }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    ragione_sociale: "", piva: "", codice_fiscale: "", ateco: "", settore: "",
    dipendenti: "", fatturato_eur: "", nazione: "IT", sito_web: "", indirizzo: "", note: ""
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const pivaValida = form.piva.length >= 11 && /^\d+$/.test(form.piva);
  const cfValido = form.codice_fiscale.length === 16;

  const handleSave = async () => {
    setErrors({});
    const result = clienteSchema.safeParse({
      ...form,
      dipendenti: form.dipendenti || undefined,
      fatturato_eur: form.fatturato_eur || undefined,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(e => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onCreate(result.data);
      toast({ title: "Cliente creato", description: result.data.ragione_sociale });
      setForm({ ragione_sociale: "", piva: "", codice_fiscale: "", ateco: "", settore: "", dipendenti: "", fatturato_eur: "", nazione: "IT", sito_web: "", indirizzo: "", note: "" });
      onClose();
    } catch (e) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border z-50 flex flex-col shadow-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Nuovo cliente</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Identificazione</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Ragione sociale *</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.ragione_sociale} onChange={e => set("ragione_sociale", e.target.value)} placeholder="Es. Acme Manufacturing S.p.A." />
                {errors.ragione_sociale && <p className="text-xs text-destructive mt-1">{errors.ragione_sociale}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">P.IVA</label>
                <div className="relative">
                  <input type="text" maxLength={16} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-8 font-mono" value={form.piva} onChange={e => set("piva", e.target.value)} placeholder="01234567890" />
                  {form.piva && (
                    <span className="absolute right-2 top-2">
                      {pivaValida ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
                    </span>
                  )}
                </div>
                {errors.piva && <p className="text-xs text-destructive mt-1">{errors.piva}</p>}
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
              <div>
                <label className="block text-xs font-medium mb-1">Nazione (ISO 2)</label>
                <input type="text" maxLength={2} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono uppercase" value={form.nazione} onChange={e => set("nazione", e.target.value.toUpperCase())} placeholder="IT" />
                {errors.nazione && <p className="text-xs text-destructive mt-1">{errors.nazione}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Dimensione</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Dipendenti (n.)</label>
                <input type="number" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.dipendenti} onChange={e => set("dipendenti", e.target.value)} placeholder="250" />
                {errors.dipendenti && <p className="text-xs text-destructive mt-1">{errors.dipendenti}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fatturato (€)</label>
                <input type="number" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.fatturato_eur} onChange={e => set("fatturato_eur", e.target.value)} placeholder="45000000" />
                {errors.fatturato_eur && <p className="text-xs text-destructive mt-1">{errors.fatturato_eur}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Indirizzo sede legale</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.indirizzo} onChange={e => set("indirizzo", e.target.value)} placeholder="Via Roma 1, 20121 Milano MI" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sito web</label>
                <input type="url" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.sito_web} onChange={e => set("sito_web", e.target.value)} placeholder="https://www.azienda.it" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Note</label>
                <input type="text" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.note} onChange={e => set("note", e.target.value)} placeholder="Note interne" />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors">
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Salvataggio…" : "Salva cliente"}
          </button>
        </div>
      </div>
    </>
  );
}
