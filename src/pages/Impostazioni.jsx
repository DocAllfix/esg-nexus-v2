import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { User, Bell, Link, Users } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const TABS = [
  { id: "profilo",      label: "Profilo utente",  icon: User },
  { id: "notifiche",    label: "Notifiche",        icon: Bell },
  { id: "integrazioni", label: "Integrazioni",     icon: Link },
  { id: "team",         label: "Team",             icon: Users },
];

function useUsersProfile(userId) {
  return useQuery({
    queryKey: ["users_profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_profile")
        .select("*")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data ?? { id: userId, full_name: "", studio_nome: "", email: "" };
    },
    enabled: !!userId,
  });
}

export default function Impostazioni() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState("profilo");

  const { data: profile } = useUsersProfile(user?.id);

  const [form, setForm] = useState({ full_name: "", studio_nome: "", email: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name:   profile.full_name  ?? "",
        studio_nome: profile.studio_nome ?? "",
        email:       profile.email ?? user?.email ?? "",
      });
    }
  }, [profile, user?.email]);

  const saveProfile = useMutation({
    mutationFn: async (payload) => {
      const { error } = await supabase
        .from("users_profile")
        .upsert({ id: user?.id, ...payload, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users_profile", user?.id] });
      toast({ title: "Profilo salvato" });
    },
    onError: (e) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });

  const initials = form.full_name
    ? form.full_name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div>
      <PageHeader title="Impostazioni" breadcrumbs={[{ label: "Impostazioni" }]} />
      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-card border border-border rounded-lg p-6">
          {tab === "profilo" && (
            <div>
              <h2 className="text-base font-semibold mb-6">Profilo utente</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold">{form.full_name || "—"}</p>
                  <p className="text-sm text-muted-foreground">{form.email || user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{form.studio_nome || "Studio ESG"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Nome completo</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Es. Luigi Fabbricini"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Nome studio</label>
                  <input
                    type="text"
                    value={form.studio_nome}
                    onChange={e => setForm(p => ({ ...p, studio_nome: e.target.value }))}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Studio Consulenza ESG S.r.l."
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => saveProfile.mutate(form)}
                  disabled={saveProfile.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saveProfile.isPending ? "Salvataggio…" : "Salva modifiche"}
                </button>
              </div>
            </div>
          )}

          {tab === "notifiche" && (
            <div>
              <h2 className="text-base font-semibold mb-6">Preferenze notifiche</h2>
              <div className="space-y-4 max-w-md">
                {[
                  ["Scadenze imminenti (24h prima)", true],
                  ["Nuovi documenti caricati", true],
                  ["Rischi critici rilevati", true],
                  ["Aggiornamento stato engagement", true],
                  ["Risposte ai questionari stakeholder", false],
                  ["Report settimanale attività", false],
                ].map(([label, checked]) => (
                  <div key={label} className="flex items-center justify-between">
                    <label className="text-sm">{label}</label>
                    <div className={cn("w-11 h-6 rounded-full cursor-pointer transition-colors relative", checked ? "bg-primary" : "bg-muted")}>
                      <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", checked ? "translate-x-5" : "translate-x-0.5")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "integrazioni" && (
            <div>
              <h2 className="text-base font-semibold mb-6">Integrazioni</h2>
              <div className="space-y-4 max-w-lg">
                {[
                  { nome: "Supabase",       desc: "Database backend — connesso",            connesso: true },
                  { nome: "Google Drive",   desc: "Sincronizzazione cartella documenti",    connesso: false },
                  { nome: "Gmail/Outlook",  desc: "Invio automatico email e remind",        connesso: false },
                  { nome: "DocuSign",       desc: "Firma digitale contratti",               connesso: false },
                ].map(int => (
                  <div key={int.nome} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{int.nome}</p>
                      <p className="text-xs text-muted-foreground">{int.desc}</p>
                    </div>
                    <span className={cn("text-xs px-3 py-1.5 rounded-full font-medium", int.connesso ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground")}>
                      {int.connesso ? "Connesso" : "Non connesso"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "team" && (
            <div>
              <h2 className="text-base font-semibold mb-6">Team — Multi-utente (in arrivo)</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Users size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Funzionalità multi-utente in sviluppo</p>
                <p className="text-xs text-muted-foreground">Sarà possibile invitare collaboratori e assegnare ruoli</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
