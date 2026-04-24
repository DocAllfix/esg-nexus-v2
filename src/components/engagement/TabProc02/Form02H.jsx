import FormWrapper, { FormSection, Field, Input, Textarea, Select, RadioGroup } from "@/components/common/FormWrapper";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const SOGLIA_IMP = 3.0;
const SOGLIA_FIN = 9.0;

const TEMI = [
  { cat: "AMBIENTE (E)", id: "E1-1", label: "Emissioni GHG Scope 1" },
  { cat: "AMBIENTE (E)", id: "E1-2", label: "Emissioni GHG Scope 2" },
  { cat: "AMBIENTE (E)", id: "E1-3", label: "Emissioni GHG Scope 3" },
  { cat: "AMBIENTE (E)", id: "E1-4", label: "Rischi fisici clima" },
  { cat: "AMBIENTE (E)", id: "E1-5", label: "Rischio transizione / ETS" },
  { cat: "AMBIENTE (E)", id: "E1-6", label: "Opp. efficienza energetica" },
  { cat: "AMBIENTE (E)", id: "E2",   label: "Inquinamento aria/acqua/suolo" },
  { cat: "AMBIENTE (E)", id: "E3",   label: "Gestione risorse idriche" },
  { cat: "AMBIENTE (E)", id: "E4",   label: "Biodiversità" },
  { cat: "AMBIENTE (E)", id: "E5",   label: "Rifiuti ed economia circolare" },
  { cat: "SOCIALE (S)",  id: "S1-1", label: "Infortuni e sicurezza" },
  { cat: "SOCIALE (S)",  id: "S1-2", label: "Formazione e sviluppo" },
  { cat: "SOCIALE (S)",  id: "S1-3", label: "Diversità e inclusione" },
  { cat: "SOCIALE (S)",  id: "S1-4", label: "Gender pay gap" },
  { cat: "SOCIALE (S)",  id: "S1-5", label: "Benessere e welfare" },
  { cat: "SOCIALE (S)",  id: "S2",   label: "Supply chain sociale" },
  { cat: "SOCIALE (S)",  id: "S3",   label: "Comunità locali" },
  { cat: "SOCIALE (S)",  id: "S4",   label: "Consumatori e prodotti" },
  { cat: "GOVERNANCE (G)", id: "G1-1", label: "Anticorruzione" },
  { cat: "GOVERNANCE (G)", id: "G1-2", label: "Whistleblowing" },
  { cat: "GOVERNANCE (G)", id: "G1-3", label: "Privacy e cybersecurity" },
  { cat: "GOVERNANCE (G)", id: "G2",   label: "Struttura CdA" },
  { cat: "GOVERNANCE (G)", id: "G3",   label: "Rischi TCFD" },
  { cat: "GOVERNANCE (G)", id: "G4",   label: "Fiscalità responsabile" },
];

export default function Form02H({ eng }) {
  // Temi con score manuale (importati da 02G; qui li si può immettere manualmente)
  const [scoreImp, setScoreImp] = useState(() => Object.fromEntries(TEMI.map(t => [t.id, ""])));
  const [scoreFin, setScoreFin] = useState(() => Object.fromEntries(TEMI.map(t => [t.id, ""])));
  const [motivazioni, setMotivazioni] = useState(() => Object.fromEntries(TEMI.map(t => [t.id, ""])));
  const [esrs, setEsrs] = useState(() => Object.fromEntries(TEMI.map(t => [t.id, ""])));

  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    versione: "bozza",
    data_emissione: "",
    nota_metodologica: "",
    approvazione: "",
    modifiche: "",
    firma_pm: "",
    firma_pm_data: "",
    firma_cli: "",
    firma_cli_data: "",
    firma_cs: "",
    firma_cda: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));

  // Calcola materialità e ranking
  const temiCalc = TEMI.map(t => {
    const si = parseFloat(scoreImp[t.id]);
    const sf = parseFloat(scoreFin[t.id]);
    const matImp = !isNaN(si) && si >= SOGLIA_IMP;
    const matFin = !isNaN(sf) && sf >= SOGLIA_FIN;
    const evaluated = !isNaN(si) || !isNaN(sf);
    const materiale = matImp || matFin;
    let tipo = "—";
    if (evaluated) {
      if (matImp && matFin) tipo = "Doppia";
      else if (matImp) tipo = "Solo impatto";
      else if (matFin) tipo = "Solo finanziaria";
      else tipo = "Non materiale";
    }
    const sortKey = (!isNaN(si) ? si : 0) + (!isNaN(sf) ? sf / 5 : 0);
    return { ...t, si: isNaN(si) ? null : si, sf: isNaN(sf) ? null : sf, matImp, matFin, materiale, tipo, evaluated, sortKey };
  }).sort((a, b) => b.sortKey - a.sortKey);

  const materiali = temiCalc.filter(t => t.materiale);
  const top5 = materiali.slice(0, 5);
  const media = materiali.slice(5);
  const nonMateriali = temiCalc.filter(t => t.evaluated && !t.materiale);

  function RankRow({ t, rank }) {
    const tipoColor = t.tipo === "Doppia" ? "bg-green-500/10 text-green-700 dark:text-green-400" :
      t.tipo === "Solo impatto" ? "bg-teal-500/10 text-teal-700 dark:text-teal-400" :
      t.tipo === "Solo finanziaria" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
      "bg-muted text-muted-foreground";

    return (
      <tr className="hover:bg-muted/20">
        <td className="px-3 py-2.5 text-center">
          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">{rank}</span>
        </td>
        <td className="px-3 py-2.5">
          <p className="font-semibold text-xs text-foreground">{t.label}</p>
          <p className="text-[10px] text-muted-foreground">{t.id} · {t.cat}</p>
        </td>
        <td className={cn("px-3 py-2.5 text-center font-bold text-xs tabular-nums", t.matImp ? "text-green-700 dark:text-green-400" : "text-muted-foreground")}>
          {t.si !== null ? t.si.toFixed(2) : "—"}
        </td>
        <td className={cn("px-3 py-2.5 text-center font-bold text-xs tabular-nums", t.matFin ? "text-green-700 dark:text-green-400" : "text-muted-foreground")}>
          {t.sf !== null ? t.sf.toFixed(2) : "—"}
        </td>
        <td className="px-3 py-2.5 text-center">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border border-transparent", tipoColor)}>{t.tipo}</span>
        </td>
        <td className="px-2 py-2.5">
          <input type="text" value={esrs[t.id]} onChange={e => setEsrs(prev => ({ ...prev, [t.id]: e.target.value }))}
            className="w-full border border-border rounded px-1.5 py-0.5 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="ESRS" />
        </td>
        <td className="px-3 py-2.5">
          <input type="text" value={motivazioni[t.id]} onChange={e => setMotivazioni(prev => ({ ...prev, [t.id]: e.target.value }))}
            className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Perché materiale" />
        </td>
      </tr>
    );
  }

  const tableHeader = (
    <tr className="border-b border-border bg-muted/30">
      <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-12">Rank</th>
      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[180px]">Tema materiale</th>
      <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-16">Score Imp.</th>
      <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-16">Score Fin.</th>
      <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-24">Tipo mat.</th>
      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">ESRS</th>
      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[180px]">Motivazione</th>
    </tr>
  );

  return (
    <FormWrapper
      formCode="FORM-02H"
      title="Matrice di Materialità — Output Finale"
      subtitle="Top priority / Media / Non materiali · ESRS applicabili · Nota metodologica"
      meta={{
        Fase: "Fase 2.7",
        Input: "FORM-02G (scoring aggregato) · Lista IRO materiali",
        Responsabile: "CS ESG + PM",
        Timing: "Settimane 6-7",
        Output: "Matrice definitiva · Lista temi materiali · Tavola ESRS",
      }}
      ruleBox={<><strong>Output finale PROC-02:</strong> lista temi materiali ordinata per score aggregato. Soglie: Impatto ≥ {SOGLIA_IMP} · Finanziario ≥ {SOGLIA_FIN}. Richiede approvazione formale del CdA.</>}
      storageKey={`form02h_${eng?.id}`}
    >
      <FormSection title="Identificazione" cols={4}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
        <Field label="Versione">
          <Select value={data.versione} onChange={set("versione")} options={[
            { value: "bozza", label: "Bozza" },
            { value: "workshop", label: "Condivisa in workshop" },
            { value: "finale", label: "✓ Finale approvata" },
          ]} />
        </Field>
        <Field label="Data emissione"><Input type="date" value={data.data_emissione} onChange={set("data_emissione")} /></Field>
      </FormSection>

      {/* Score input (importo da 02G o manuale) */}
      <FormSection title="Score per tema (importare da FORM-02G o compilare manualmente)" cols={1}>
        <div className="bg-muted/20 border border-border/60 rounded-lg px-3 py-2 text-xs text-muted-foreground mb-3">
          Inserire i punteggi finali aggregati per ogni tema (dalla FORM-02G). La matrice si aggiorna automaticamente.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-muted-foreground font-semibold uppercase tracking-widest text-[10px] min-w-[200px]">Tema</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-semibold uppercase tracking-widest text-[10px] w-24">Score Imp. (0-5)</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-semibold uppercase tracking-widest text-[10px] w-24">Score Fin. (0-25)</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-semibold uppercase tracking-widest text-[10px] w-20">Materiale?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEMI.map(t => {
                const si = parseFloat(scoreImp[t.id]);
                const sf = parseFloat(scoreFin[t.id]);
                const matImp = !isNaN(si) && si >= SOGLIA_IMP;
                const matFin = !isNaN(sf) && sf >= SOGLIA_FIN;
                const isMat = matImp || matFin;
                return (
                  <tr key={t.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium text-foreground">{t.label} <span className="text-muted-foreground text-[10px]">({t.id})</span></td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" step="0.1" min="0" max="5" value={scoreImp[t.id]}
                        onChange={e => setScoreImp(prev => ({ ...prev, [t.id]: e.target.value }))}
                        className={cn("w-16 border rounded px-1.5 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring",
                          matImp ? "border-green-500/30 bg-green-500/5" : "border-border"
                        )} placeholder="0.00" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" step="0.1" min="0" max="25" value={scoreFin[t.id]}
                        onChange={e => setScoreFin(prev => ({ ...prev, [t.id]: e.target.value }))}
                        className={cn("w-16 border rounded px-1.5 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring",
                          matFin ? "border-green-500/30 bg-green-500/5" : "border-border"
                        )} placeholder="0.00" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      {(!isNaN(si) || !isNaN(sf)) ? (
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          isMat ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30" : "bg-muted text-muted-foreground border-border"
                        )}>
                          {isMat ? "SÌ" : "no"}
                        </span>
                      ) : <span className="text-muted-foreground/40 text-[10px]">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* Top 5 */}
      <FormSection title="🔴 Temi ad alta materialità — Top 5" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>{tableHeader}</thead>
            <tbody className="divide-y divide-border">
              {top5.length > 0 ? top5.map((t, i) => <RankRow key={t.id} t={t} rank={i+1} />) : (
                <tr><td colSpan={7} className="text-center py-6 text-xs text-muted-foreground italic">Nessun tema elaborato — compilare gli score sopra</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* Media */}
      {media.length > 0 && (
        <FormSection title="🟡 Temi a media materialità" cols={1}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>{tableHeader}</thead>
              <tbody className="divide-y divide-border">
                {media.map((t, i) => <RankRow key={t.id} t={t} rank={i+6} />)}
              </tbody>
            </table>
          </div>
        </FormSection>
      )}

      {/* Non materiali */}
      {nonMateriali.length > 0 && (
        <FormSection title="⚪ Temi non materiali (monitorati)" cols={1}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>{tableHeader}</thead>
              <tbody className="divide-y divide-border">
                {nonMateriali.map((t, i) => <RankRow key={t.id} t={t} rank="n.m." />)}
              </tbody>
            </table>
          </div>
        </FormSection>
      )}

      <FormSection title="Nota metodologica (da includere nel Bilancio di Sostenibilità)" cols={1}>
        <div className="bg-blue-500/8 border border-blue-500/30 text-blue-700 dark:text-blue-300 rounded-lg px-3 py-2 text-xs mb-3">
          Nota da includere nel Bilancio. Descrive il processo di analisi: periodo, metodo, stakeholder coinvolti, soglie, risultati.
        </div>
        <Field label="Nota metodologica">
          <Textarea value={data.nota_metodologica} onChange={set("nota_metodologica")} rows={8}
            placeholder={`[ORGANIZZAZIONE] ha condotto la propria analisi di materialità secondo il principio della Doppia Materialità (Direttiva UE 2022/2464 CSRD, ESRS 1). Il processo si è svolto nel periodo [...] e ha coinvolto [...] stakeholder interni e [...] stakeholder esterni attraverso survey digitali, interviste e workshop dedicati...`}
          />
        </Field>
      </FormSection>

      <FormSection title="Approvazione formale" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={data.approvazione} onChange={set("approvazione")} options={[
            { value: "approvata", label: "✅ Approvata — Autorizzazione avvio PROC-03 (Gap Analysis) e PROC-04 (Raccolta Dati)" },
            { value: "modifiche", label: "⚠ Approvata con modifiche — dettaglio sotto" },
            { value: "respinta", label: "🛑 Respinta — ricondurre a FORM-02G con rettifiche" },
          ]} />
        </Field>
        <Field label="Dettaglio modifiche richieste" span={2}><Textarea value={data.modifiche} onChange={set("modifiche")} rows={2} /></Field>
      </FormSection>

      <FormSection title="Firme" cols={3}>
        <Field label="PM Consulenza"><Input value={data.firma_pm} onChange={set("firma_pm")} /></Field>
        <Field label="Data firma PM"><Input type="date" value={data.firma_pm_data} onChange={set("firma_pm_data")} /></Field>
        <Field label="Referente Cliente"><Input value={data.firma_cli} onChange={set("firma_cli")} /></Field>
        <Field label="Data firma Cliente"><Input type="date" value={data.firma_cli_data} onChange={set("firma_cli_data")} /></Field>
        <Field label="CS ESG"><Input value={data.firma_cs} onChange={set("firma_cs")} /></Field>
        <Field label="CdA / Management (se richiesto)"><Input value={data.firma_cda} onChange={set("firma_cda")} /></Field>
      </FormSection>
    </FormWrapper>
  );
}