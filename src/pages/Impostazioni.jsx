import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { User, Bell, Link, Users } from "lucide-react";

const TABS = [
  { id: "profilo", label: "Profilo utente", icon: User },
  { id: "notifiche", label: "Notifiche", icon: Bell },
  { id: "integrazioni", label: "Integrazioni", icon: Link },
  { id: "team", label: "Team", icon: Users },
];

export default function Impostazioni() {
  const [tab, setTab] = useState("profilo");

  return (
    <div>
      <PageHeader title="Impostazioni" breadcrumbs={[{ label: "Impostazioni" }]} />
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenuto */}
        <div className="flex-1 bg-card border border-border rounded-lg p-6">
          {tab === "profilo" && (
            <div>
              <h2 className="text-base font-semibold mb-6">Profilo utente</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">EM</div>
                <div>
                  <p className="font-semibold">Dr.ssa Elena Mancini</p>
                  <p className="text-sm text-muted-foreground">elena.mancini@studioesg.it</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Consulente Senior ESG</p>
                </div>
                <button className="ml-auto px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">Cambia foto</button>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                {[["Nome", "Elena"], ["Cognome", "Mancini"], ["Email", "elena.mancini@studioesg.it"], ["Telefono", "+39 02 9876543"], ["Qualifica", "Consulente Senior ESG"], ["Studio", "Studio Consulenza ESG S.r.l."]].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs font-medium mb-1">{label}</label>
                    <input type="text" defaultValue={val} className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Salva modifiche</button>
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
                  { nome: "Google Drive", desc: "Sincronizzazione cartella documenti cliente", connesso: true },
                  { nome: "Gmail / Outlook", desc: "Invio automatico email e remind", connesso: false },
                  { nome: "Supabase", desc: "Database backend (in configurazione)", connesso: false },
                  { nome: "DocuSign", desc: "Firma digitale contratti", connesso: false },
                ].map(int => (
                  <div key={int.nome} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{int.nome}</p>
                      <p className="text-xs text-muted-foreground">{int.desc}</p>
                    </div>
                    <span className={cn("text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer", int.connesso ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors")}>
                      {int.connesso ? "Connesso" : "Connetti"}
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