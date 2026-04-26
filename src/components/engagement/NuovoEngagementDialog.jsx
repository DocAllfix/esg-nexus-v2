import { useState } from "react";
import { X } from "lucide-react";
import { engagementSchema } from "@/schemas/index";
import { useClienti } from "@/hooks/useClienti";
import { useCreateEngagement } from "@/hooks/useEngagements";
import { useToast } from "@/components/ui/use-toast";

const STANDARD_OPTIONS = ["GRI", "CSRD_ESRS", "ENTRAMBI"];
const currentYear = new Date().getFullYear();
const ANNI = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

export default function NuovoEngagementDialog({ open, onClose }) {
  const { toast } = useToast();
  const { data: clienti = [] } = useClienti();
  const createEngagement = useCreateEngagement();

  const [form, setForm] = useState({
    cliente_id: "", anno_rendicontazione: String(currentYear), standard: "GRI",
    data_avvio: "", data_fine_prevista: "", budget_contrattuale: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setErrors({});
    const result = engagementSchema.safeParse({
      ...form,
      budget_contrattuale: form.budget_contrattuale || undefined,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(e => { fieldErrors[e.path[0]] = e.message; });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createEngagement.mutateAsync(result.data);
      toast({ title: "Engagement creato con successo" });
      setForm({ cliente_id: "", anno_rendicontazione: String(currentYear), standard: "GRI", data_avvio: "", data_fine_prevista: "", budget_contrattuale: "" });
      onClose();
    } catch (e) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold">Nuovo engagement</h2>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1">Cliente *</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.cliente_id}
                onChange={e => set("cliente_id", e.target.value)}
              >
                <option value="">Seleziona cliente</option>
                {clienti.map(c => (
                  <option key={c.id} value={c.id}>{c.ragione_sociale}</option>
                ))}
              </select>
              {errors.cliente_id && <p className="text-xs text-destructive mt-1">{errors.cliente_id}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Anno rendicontazione *</label>
                <select
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.anno_rendicontazione}
                  onChange={e => set("anno_rendicontazione", e.target.value)}
                >
                  {ANNI.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.anno_rendicontazione && <p className="text-xs text-destructive mt-1">{errors.anno_rendicontazione}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Standard *</label>
                <select
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.standard}
                  onChange={e => set("standard", e.target.value)}
                >
                  {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", "/")}</option>)}
                </select>
                {errors.standard && <p className="text-xs text-destructive mt-1">{errors.standard}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Data avvio</label>
                <input type="date" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={form.data_avvio} onChange={e => set("data_avvio", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Chiusura prevista</label>
                <input type="date" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={form.data_fine_prevista} onChange={e => set("data_fine_prevista", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">Budget contrattuale (€)</label>
                <input type="number" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring" value={form.budget_contrattuale} onChange={e => set("budget_contrattuale", e.target.value)} placeholder="25000" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors">
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={createEngagement.isPending}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createEngagement.isPending ? "Creazione…" : "Crea engagement"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
