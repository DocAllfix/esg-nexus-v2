import { useState, useMemo } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_engagement_ESG-2025-ACM-001_form_00C";
const INITIAL = acmeFormData["00C"] ?? {};

const CRITERI = [
  {
    cat: "MOTIVAZIONE E STRATEGIA",
    items: [
      { key: "motivazione", label: "Motivazione reale all'ESG (non solo comunicativa)", peso: 20 },
      { key: "chiarezza", label: "Chiarezza degli obiettivi ESG del management", peso: 0 },
      { key: "allineamento", label: "Allineamento ESG con strategia aziendale", peso: 0 },
    ]
  },
  {
    cat: "DATI E STRUTTURA INTERNA",
    items: [
      { key: "dati_e", label: "Disponibilità dati ambientali (E) utilizzabili", peso: 20 },
      { key: "dati_s", label: "Disponibilità dati sociali (S) utilizzabili", peso: 0 },
      { key: "dati_g", label: "Disponibilità dati di governance (G) utilizzabili", peso: 0 },
      { key: "referente", label: "Qualità del referente interno (competenza, autonomia)", peso: 15 },
    ]
  },
  {
    cat: "COMMITMENT E FATTIBILITÀ",
    items: [
      { key: "commitment", label: "Livello di commitment del top management", peso: 15 },
      { key: "budget", label: "Budget adeguato agli obiettivi dichiarati", peso: 15 },
      { key: "tempistiche", label: "Compatibilità tempistiche con capacità produttiva", peso: 10 },
      { key: "maturita", label: "Maturità organizzativa per recepire il cambiamento ESG", peso: 0 },
    ]
  },
  {
    cat: "POTENZIALE COMMERCIALE",
    items: [
      { key: "potenziale", label: "Potenziale di sviluppo del rapporto nel tempo", peso: 5 },
      { key: "referral", label: "Probabilità di referral / raccomandazioni future", peso: 0 },
      { key: "strategico", label: "Valore strategico del cliente per posizionamento studio", peso: 0 },
    ]
  }
];

const LABELS = { 1: "🔴 Molto basso", 2: "🟠 Basso", 3: "🟡 Medio", 4: "🟢 Alto", 5: "🔵 Molto alto" };
const COLORS_SCORE = { 1: "text-red-600 bg-red-50", 2: "text-orange-600 bg-orange-50", 3: "text-yellow-600 bg-yellow-50", 4: "text-green-600 bg-green-50", 5: "text-blue-600 bg-blue-50" };

export default function Form00C() {
  const [d, setD] = useState(INITIAL);
  const [scores, setScores] = useState(INITIAL.scores || {});
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const setScore = (k, v) => setScores(prev => ({ ...prev, [k]: Number(v) }));

  const { pesato, rawAvg, decisione } = useMemo(() => {
    const allKeys = CRITERI.flatMap(c => c.items.map(i => i.key));
    const totalPeso = CRITERI.flatMap(c => c.items).reduce((s, i) => s + i.peso, 0);
    let pesato = 0;
    let sumAll = 0, countAll = 0;
    CRITERI.flatMap(c => c.items).forEach(item => {
      const v = scores[item.key] || 0;
      if (item.peso > 0 && v > 0) pesato += (v * item.peso) / totalPeso;
      if (v > 0) { sumAll += v; countAll++; }
    });
    const rawAvg = countAll > 0 ? sumAll / countAll : 0;
    const decisione = pesato >= 4.0 ? "GO" : pesato >= 3.0 ? "CONDIZIONATO" : "NOGO";
    return { pesato, rawAvg, decisione };
  }, [scores]);

  const radarData = CRITERI.flatMap(c => c.items).map(item => ({
    criterio: item.label.length > 30 ? item.label.substring(0, 28) + "…" : item.label,
    valore: scores[item.key] || 0
  }));

  const decisioneConfig = {
    GO: { label: "✅ GO — Procedi con offerta", cls: "bg-green-100 text-green-800 border-green-300" },
    CONDIZIONATO: { label: "⚠ GO CONDIZIONATO — Valutazione con partner", cls: "bg-amber-100 text-amber-800 border-amber-300" },
    NOGO: { label: "🛑 NO-GO — Declinare con email motivata", cls: "bg-red-100 text-red-800 border-red-300" }
  };

  return (
    <FormWrapper
      formCode="FORM-00C"
      title="Score di Pre-Qualifica"
      subtitle="Griglia di valutazione per la decisione Go / No-Go"
      meta={{ "Fase": "0.5", "Resp.": "Consulente Senior ESG", "Input": "FORM-00A + 00B", "Timing": "Entro 2 giorni dal questionario", "Output": "Score pesato + decisione Go/No-Go" }}
      ruleBox="⚠ USO INTERNO: da compilare esclusivamente dal Consulente Senior ESG. Non condividere con il cliente."
      ruleBoxType="danger"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >

      <FormSection title="Dati di riferimento">
        <Field label="Cliente"><Input value={d.cliente_nome} onChange={v => set("cliente_nome", v)} /></Field>
        <Field label="Data valutazione"><Input type="date" value={d.data_valutazione} onChange={v => set("data_valutazione", v)} /></Field>
        <Field label="Consulente"><Input value={d.consulente} onChange={v => set("consulente", v)} /></Field>
        <Field label="CRM ID"><Input value={d.crm_id} onChange={v => set("crm_id", v)} className="font-mono" /></Field>
      </FormSection>

      {/* GRIGLIA 14 CRITERI */}
      <FormSection title="Griglia di valutazione — 14 criteri" cols={1}>
        <div className="text-xs text-muted-foreground bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-3">
          <strong>Scala:</strong> 1 🔴 Molto basso · 2 🟠 Basso · 3 🟡 Medio · 4 🟢 Alto · 5 🔵 Molto alto. &nbsp;
          <strong>Pesi:</strong> solo 7 criteri principali hanno peso (20/20/15/15/15/10/5 = 100%). Gli altri alimentano il "raw average".
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold">
                <th className="text-left px-4 py-2 w-[45%]">Criterio</th>
                {[1,2,3,4,5].map(n => <th key={n} className="px-3 py-2 text-center">{n}</th>)}
                <th className="px-3 py-2 text-center">Peso</th>
                <th className="px-3 py-2 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {CRITERI.map((gruppo, gi) => (
                <>
                  <tr key={`cat-${gi}`} className="bg-muted/60">
                    <td colSpan={8} className="px-4 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{gruppo.cat}</td>
                  </tr>
                  {gruppo.items.map((item) => (
                    <tr key={item.key} className="border-t border-border hover:bg-muted/20">
                      <td className="px-4 py-2">{item.label}</td>
                      {[1,2,3,4,5].map(n => (
                        <td key={n} className="px-3 py-2 text-center">
                          <input
                            type="radio"
                            name={`score_${item.key}`}
                            value={n}
                            checked={scores[item.key] === n}
                            onChange={() => setScore(item.key, n)}
                            className="accent-primary"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center text-xs font-mono text-muted-foreground">
                        {item.peso > 0 ? `${item.peso}%` : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {scores[item.key] ? (
                          <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", COLORS_SCORE[scores[item.key]])}>
                            {scores[item.key]}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* SCORE SUMMARY + RADAR */}
      <FormSection title="Score Summary" cols={1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={cn("rounded-xl border-2 p-6 space-y-4", decisioneConfig[decisione].cls)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">Score pesato</p>
                <p className="text-5xl font-bold tabular-nums">{pesato.toFixed(2)}<span className="text-xl font-normal ml-1">/5.00</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">Raw average</p>
                <p className="text-3xl font-semibold tabular-nums">{rawAvg.toFixed(2)}<span className="text-sm font-normal ml-1">/5.00</span></p>
              </div>
            </div>
            <div className="border-t border-current/20 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1">Decisione raccomandata</p>
              <p className="text-lg font-bold">{decisioneConfig[decisione].label}</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criterio" tick={{ fontSize: 9 }} />
                <Radar name="Score" dataKey="valore" stroke="#0F766E" fill="#0F766E" fillOpacity={0.35} />
                <Tooltip formatter={(v) => [`${v}/5`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FormSection>

      {/* NOTE */}
      <FormSection title="Note e motivazione decisione" cols={1}>
        <Field label="Punti di forza del cliente">
          <Textarea value={d.punti_forza} onChange={v => set("punti_forza", v)} rows={3} />
        </Field>
        <Field label="Criticità e rischi identificati">
          <Textarea value={d.criticita} onChange={v => set("criticita", v)} rows={3} />
        </Field>
        <Field label="Motivazione della decisione">
          <Textarea value={d.motivazione_decisione} onChange={v => set("motivazione_decisione", v)} rows={3} />
        </Field>
        <Field label="Decisione finale" span={2}>
          <div className="space-y-2">
            {[
              { v: "GO", label: "✅ GO (score ≥ 4.0) — Procedi con offerta" },
              { v: "CONDIZIONATO", label: "⚠ GO CONDIZIONATO (3.0–3.9) — Valutazione con partner" },
              { v: "NOGO", label: "🛑 NO-GO (< 3.0) — Declinare con email motivata" },
            ].map(opt => (
              <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="decisione_finale" value={opt.v} checked={d.decisione_finale === opt.v} onChange={() => set("decisione_finale", opt.v)} className="accent-primary" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Firma consulente">
          <Input value={d.firma_consulente} onChange={v => set("firma_consulente", v)} placeholder="Nome e qualifica" />
        </Field>
        <Field label="Data firma">
          <Input type="date" value={d.firma_data} onChange={v => set("firma_data", v)} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}