import { CHAPTERS, GRI_DISCLOSURES, ESRS_DATAPOINTS } from "@/lib/bilancio/fieldMaps";
import { extractAllGri, extractAllEsrs, atom } from "@/lib/bilancio/extractors";
import { resolveChapterBody, fillPlaceholders } from "@/lib/bilancio/chapters";

/**
 * Renderizza un paragrafo Markdown-light: doppi-newline = nuovo paragrafo,
 * **bold**, lista con "- " a inizio riga.
 */
function renderParagraph(text, key) {
  const lines = text.split("\n");
  return (
    <p key={key} className="mb-3 text-sm leading-relaxed text-justify">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isListItem = trimmed.startsWith("- ");
        if (isListItem) {
          return (
            <span key={i} className="block pl-4">
              {renderInline(trimmed.slice(2))}
            </span>
          );
        }
        return (
          <span key={i}>
            {renderInline(line)}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </p>
  );
}

function renderInline(text) {
  // Sostituisce **bold** con <strong>
  const parts = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={key++}>{m[1]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderBody(text, baseKey) {
  if (!text) return <p className="text-amber-700 italic">[Capitolo da compilare]</p>;
  return text.split(/\n\n+/).map((p, i) => renderParagraph(p, `${baseKey}-${i}`));
}

function KpiTable({ ctx, anno }) {
  const rows = [
    { area: "Sociale",    label: "Dipendenti totali",          v: atom.dipendenti(ctx) },
    { area: "Sociale",    label: "Quota femminile",            v: atom.socKpi(ctx, "donne_percentuale"), unit: "%" },
    { area: "Sociale",    label: "Ore formazione pro-capite",  v: atom.socKpi(ctx, "ore_formazione") },
    { area: "Sociale",    label: "Tasso frequenza infortuni",  v: atom.socKpi(ctx, "tasso_frequenza") },
    { area: "Sociale",    label: "Tasso gravità infortuni",    v: atom.socKpi(ctx, "tasso_gravita") },
    { area: "Sociale",    label: "Turnover",                   v: atom.socKpi(ctx, "turnover"), unit: "%" },
    { area: "Ambiente",   label: "Consumo energetico",         v: atom.envKpi(ctx, "energia_totale"), unit: "GJ" },
    { area: "Ambiente",   label: "Quota rinnovabile",          v: atom.envKpi(ctx, "rinnovabile"), unit: "%" },
    { area: "Ambiente",   label: "Emissioni Scope 1",          v: atom.scope1Total(ctx), unit: "tCO2e" },
    { area: "Ambiente",   label: "Emissioni Scope 2 (mb)",     v: atom.scope2MbTotal(ctx), unit: "tCO2e" },
    { area: "Ambiente",   label: "Emissioni Scope 3",          v: atom.scope3Total(ctx), unit: "tCO2e" },
    { area: "Ambiente",   label: "Prelievo idrico",            v: atom.envKpi(ctx, "prelievo_idrico"), unit: "m³" },
    { area: "Ambiente",   label: "Rifiuti totali",             v: atom.envKpi(ctx, "rifiuti_totali"), unit: "kg" },
    { area: "Governance", label: "Riunioni CdA",               v: atom.govKpi(ctx, "cda_riunioni") },
    { area: "Governance", label: "Sanzioni ricevute",          v: atom.govKpi(ctx, "sanzioni_n") },
    { area: "Governance", label: "Data breach",                v: atom.govKpi(ctx, "data_breach") },
    { area: "Governance", label: "Imposte pagate",             v: atom.govKpi(ctx, "imposte_pagate"), unit: "€" },
  ].filter((r) => r.v !== null && r.v !== undefined && r.v !== "");

  if (rows.length === 0) {
    return <p className="text-amber-700 italic">[Nessun KPI estratto dai PROC]</p>;
  }
  return (
    <table className="w-full border border-border text-xs my-3">
      <thead>
        <tr className="bg-muted">
          <th className="border border-border px-2 py-1 text-left">Area</th>
          <th className="border border-border px-2 py-1 text-left">KPI</th>
          <th className="border border-border px-2 py-1 text-right">{anno}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="border border-border px-2 py-1 text-muted-foreground">{r.area}</td>
            <td className="border border-border px-2 py-1">{r.label}</td>
            <td className="border border-border px-2 py-1 text-right font-mono">
              {r.v}{r.unit ? ` ${r.unit}` : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GriIndexTable({ ctx, overridesGri, denom, periodo }) {
  const griValues = extractAllGri(ctx);
  return (
    <>
      <p className="text-xs text-muted-foreground mb-2">
        Dichiarazione di utilizzo: <strong>{denom}</strong> ha rendicontato in conformità con i GRI Standards per il periodo {periodo}.
      </p>
      <table className="w-full border border-border text-xs my-3">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-2 py-1 text-left">Disclosure</th>
            <th className="border border-border px-2 py-1 text-left">Titolo</th>
            <th className="border border-border px-2 py-1 text-left">Localizzazione</th>
            <th className="border border-border px-2 py-1 text-left">Note / Valore</th>
          </tr>
        </thead>
        <tbody>
          {GRI_DISCLOSURES.map((g) => {
            const v = overridesGri[g.code] || griValues[g.code];
            const display = v === null || v === undefined ? "—" :
              typeof v === "object" ? JSON.stringify(v).slice(0, 200) : String(v).slice(0, 200);
            return (
              <tr key={g.code}>
                <td className="border border-border px-2 py-1 font-mono">GRI {g.code}</td>
                <td className="border border-border px-2 py-1">{g.title}</td>
                <td className="border border-border px-2 py-1 text-muted-foreground text-[10px]">
                  Cap. {g.chapter}
                </td>
                <td className="border border-border px-2 py-1 text-[11px]">{display}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function EsrsIndexTable({ ctx, overridesEsrs }) {
  const esrsValues = extractAllEsrs(ctx);
  return (
    <table className="w-full border border-border text-xs my-3">
      <thead>
        <tr className="bg-muted">
          <th className="border border-border px-2 py-1 text-left">Datapoint</th>
          <th className="border border-border px-2 py-1 text-left">Titolo</th>
          <th className="border border-border px-2 py-1 text-left">Area</th>
          <th className="border border-border px-2 py-1 text-left">Valore</th>
        </tr>
      </thead>
      <tbody>
        {ESRS_DATAPOINTS.map((e) => {
          const v = overridesEsrs[e.code] || esrsValues[e.code];
          const display = v === null || v === undefined ? "—" :
            typeof v === "object" ? JSON.stringify(v).slice(0, 160) : String(v).slice(0, 160);
          return (
            <tr key={e.code}>
              <td className="border border-border px-2 py-1 font-mono">{e.code}</td>
              <td className="border border-border px-2 py-1">{e.title}</td>
              <td className="border border-border px-2 py-1 text-muted-foreground">{e.area}</td>
              <td className="border border-border px-2 py-1 text-[11px]">{display}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * Renderizza l'intero bilancio in HTML serif "documento".
 * Props:
 *   - ctx: engagement context (da useEngagementContext)
 *   - identificazione: form_data 08A
 *   - capitoliInclusi: array di chapter id (da form_data 08E)
 *   - chapterOverrides: form_data 08F (testi capitoli editati)
 *   - overridesGri: form_data 08C
 *   - overridesEsrs: form_data 08D
 */
export default function BilancioPreview({
  ctx,
  identificazione = {},
  capitoliInclusi,
  chapterOverrides = {},
  overridesGri = {},
  overridesEsrs = {},
}) {
  const denom = identificazione.denominazione || atom.ragioneSociale(ctx) || "—";
  const anno = identificazione.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";
  const periodo = identificazione.periodo || atom.periodoRendicontazione(ctx);
  const codice = identificazione.codice_bilancio || ctx.engagement?.codice_progetto || "";
  const fw = identificazione.framework || ctx.engagement?.standard;
  const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS / CSRD" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";

  // Default: tutti i capitoli inclusi
  const incluso = (id) => !capitoliInclusi || capitoliInclusi.includes(id);
  const visibleChapters = CHAPTERS.filter((c) => incluso(c.id));

  return (
    <div
      id="bilancio-preview"
      className="bg-white text-gray-900 mx-auto max-w-[840px] p-12 shadow-lg"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* COPERTINA */}
      <div className="text-center py-12 border-b-2 border-orange-700/30">
        {codice && (
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-3">{codice}</p>
        )}
        <h1 className="text-4xl font-bold text-orange-900 mt-4 mb-1">
          Bilancio di Sostenibilità
        </h1>
        <p className="text-2xl text-orange-700 mb-6">{anno}</p>
        <p className="text-xl font-semibold mt-6">{denom}</p>
        {periodo && <p className="text-sm text-gray-600 mt-2">Periodo: {periodo}</p>}
        {identificazione.note_copertina && (
          <p className="text-sm text-gray-600 mt-6 max-w-md mx-auto">
            {identificazione.note_copertina}
          </p>
        )}
        <p className="text-xs text-gray-700 mt-8">{fwLabel}</p>
      </div>

      {/* INDICE */}
      <div className="my-10 bg-orange-50 border-l-4 border-orange-700 p-5">
        <h3 className="text-xs uppercase tracking-wider text-orange-900 font-bold mb-3">Indice</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          {visibleChapters.map((c) => (
            <li key={c.id}>{c.title}</li>
          ))}
        </ol>
      </div>

      {/* CAPITOLI */}
      {visibleChapters.map((ch, idx) => {
        const num = String(idx + 1).padStart(2, "0");
        const data = chapterOverrides[ch.id] || {};
        const titleOverride = data.title || ch.title;
        const abstract = data.abstract;

        return (
          <section key={ch.id} className="mt-10">
            <h2 className="text-xl font-bold text-orange-900 mb-3 border-b border-orange-200 pb-1">
              {num}. {fillPlaceholders(titleOverride, ctx, identificazione)}
            </h2>
            {abstract && (
              <div className="border-l-4 border-orange-700 bg-orange-50 px-4 py-2 italic text-sm text-gray-700 mb-3">
                {fillPlaceholders(abstract, ctx, identificazione)}
              </div>
            )}

            {ch.id === "kpi" ? (
              <KpiTable ctx={ctx} anno={anno} />
            ) : ch.id === "index" ? (
              <>
                {(fw === "ENTRAMBI" || fw === "GRI") && (
                  <>
                    <h3 className="text-base font-semibold text-blue-800 mt-5 mb-2">GRI Content Index</h3>
                    <GriIndexTable ctx={ctx} overridesGri={overridesGri} denom={denom} periodo={periodo} />
                  </>
                )}
                {(fw === "ENTRAMBI" || fw === "CSRD_ESRS") && (
                  <>
                    <h3 className="text-base font-semibold text-green-800 mt-5 mb-2">ESRS Datapoint Index</h3>
                    <EsrsIndexTable ctx={ctx} overridesEsrs={overridesEsrs} />
                  </>
                )}
              </>
            ) : (
              renderBody(
                resolveChapterBody(ch.id, chapterOverrides, ctx, identificazione),
                ch.id
              )
            )}
          </section>
        );
      })}

      {/* FOOTER */}
      <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        {denom} · Bilancio di Sostenibilità {anno} · {codice}
        <br />
        Generato con ESG Nexus · {new Date().toLocaleDateString("it-IT")}
      </div>
    </div>
  );
}
