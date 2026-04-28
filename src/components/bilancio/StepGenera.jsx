import { useState } from "react";
import { useBilanci, useGenerateBilancio, getBilancioFileUrl } from "@/hooks/useBilancio";
import { computeWarnings } from "@/lib/bilancio/coverage";
import { Loader2, Download, FileText, AlertTriangle, FileType, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepGenera({ engagementId, ctx, identificazione, onBack }) {
  const { data: bilanci = [], isLoading: bilLoading } = useBilanci(engagementId);
  const { mutate: generate, isPending } = useGenerateBilancio();
  const [error, setError] = useState(null);

  const { warnings, coverage } = computeWarnings(ctx);
  const errors = warnings.filter((w) => w.severity === "error");
  const warns = warnings.filter((w) => w.severity === "warning");

  // Versione successiva: se non esistono bilanci → R1, altrimenti R(n+1)
  const nextVersion = (() => {
    if (bilanci.length === 0) return "R1";
    const numbers = bilanci
      .map((b) => /^R(\d+)$/i.exec(b.versione)?.[1])
      .filter(Boolean)
      .map(Number);
    const max = numbers.length ? Math.max(...numbers) : 0;
    return `R${max + 1}`;
  })();

  const handleGenerate = () => {
    setError(null);
    generate(
      { engagementId, versione: nextVersion },
      {
        onError: (e) => setError(e.message || "Errore sconosciuto"),
      }
    );
  };

  const [pdfBusy, setPdfBusy] = useState(null); // id del bilancio in conversione

  const downloadFromStorage = async (path, filename) => {
    if (!path) return;
    const url = await getBilancioFileUrl(path);
    if (!url) {
      setError("Impossibile generare il link di download");
      return;
    }
    // Forza il download del file (vs apertura inline) prendendo il blob
    const resp = await fetch(url);
    const blob = await resp.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  // PDF: scarica l'HTML salvato in Storage, lo monta in un IFRAME nascosto
  // (così gli stili globali del bilancio non collidono con quelli dell'app),
  // attende il rendering, e passa il body dell'iframe ad html2pdf per la
  // conversione in PDF. Risultato: PDF identico all'anteprima HTML.
  const downloadAsPdf = async (bilancio) => {
    if (!bilancio.html_path) {
      setError("HTML del bilancio non disponibile per la conversione PDF");
      return;
    }
    setPdfBusy(bilancio.id);
    setError(null);

    let iframe = null;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const url = await getBilancioFileUrl(bilancio.html_path);
      if (!url) throw new Error("Impossibile recuperare l'HTML del bilancio");
      const htmlText = await (await fetch(url)).text();

      // Crea iframe nascosto MA con dimensioni reali — html2canvas richiede
      // che l'elemento sia "rendered" nel layout, non display:none.
      iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "0";
      iframe.style.top = "0";
      iframe.style.width = "880px";
      iframe.style.height = "100vh";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.zIndex = "-9999";
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);

      // srcdoc → documento isolato, stessi-origine, con i propri stili
      iframe.srcdoc = htmlText;

      // Aspetta load dell'iframe
      await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("Timeout caricamento iframe")), 8000);
        iframe.addEventListener("load", () => { clearTimeout(t); resolve(); }, { once: true });
      });
      // Aspetta che il browser completi il layout/render dei font
      await new Promise((r) => setTimeout(r, 600));

      const targetDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!targetDoc || !targetDoc.body) throw new Error("Impossibile accedere al documento iframe");

      const filename = `Bilancio_${bilancio.versione}.pdf`;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: "#ffffff",
            windowWidth: 880,
            // Riferisci esplicitamente al window dell'iframe — fondamentale
            // perché html2canvas leggerà gli stili da QUEL document
            scrollX: 0,
            scrollY: 0,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(targetDoc.body)
        .save();
    } catch (e) {
      setError(`Errore generazione PDF: ${e.message}`);
    } finally {
      if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
      setPdfBusy(null);
    }
  };

  const STATO_BADGE = {
    BOZZA:                "bg-gray-100 text-gray-700",
    GENERAZIONE_IN_CORSO: "bg-blue-100 text-blue-700",
    REVISIONE:            "bg-amber-100 text-amber-700",
    APPROVATO:            "bg-green-100 text-green-700",
    PUBBLICATO:           "bg-teal-100 text-teal-700",
  };

  return (
    <div className="space-y-5">
      {/* Pre-check */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-1">Genera versione del bilancio</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Il motore di generazione legge tutti i dati dell'engagement, applica gli override
          e produce un file HTML autonomo memorizzato in modo sicuro.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className="text-2xl font-bold tabular-nums text-primary">{coverage.gri}<span className="text-base">%</span></p>
            <p className="text-xs text-muted-foreground">Copertura GRI</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className="text-2xl font-bold tabular-nums text-primary">{coverage.esrs}<span className="text-base">%</span></p>
            <p className="text-xs text-muted-foreground">Copertura ESRS</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className="text-2xl font-bold tabular-nums">{nextVersion}</p>
            <p className="text-xs text-muted-foreground">Prossima versione</p>
          </div>
        </div>

        {(errors.length > 0 || warns.length > 0) && (
          <div className="space-y-2 mb-4">
            {errors.map((w) => (
              <div key={w.code} className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs">
                <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                <div><strong>Errore — {w.chapter}:</strong> {w.message}</div>
              </div>
            ))}
            {warns.slice(0, 3).map((w) => (
              <div key={w.code} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div><strong>{w.chapter}:</strong> {w.message}</div>
              </div>
            ))}
            {warns.length > 3 && (
              <p className="text-xs text-muted-foreground">+ altri {warns.length - 3} warning</p>
            )}
          </div>
        )}

        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isPending || !identificazione.framework}
          className={cn(
            "w-full py-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            isPending
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generazione in corso (10–30s)…
            </>
          ) : (
            <>
              <FileText size={16} />
              Genera bilancio versione {nextVersion}
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          La generazione esegue il motore lato server (Edge Function) e salva il documento in Supabase Storage.
        </p>
      </div>

      {/* Lista versioni precedenti */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Versioni generate</h3>
        </div>
        {bilLoading ? (
          <div className="p-5 text-center text-xs text-muted-foreground">Caricamento…</div>
        ) : bilanci.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nessuna versione ancora generata.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bilanci.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-primary shrink-0">
                  {b.versione}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">Versione {b.versione}</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase", STATO_BADGE[b.stato])}>
                      {b.stato.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{b.framework}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Generato {b.generated_at ? new Date(b.generated_at).toLocaleString("it-IT") : "—"} ·
                    GRI {b.copertura_gri ?? 0}% · ESRS {b.copertura_esrs ?? 0}%
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {b.stato === "GENERAZIONE_IN_CORSO" ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <Loader2 size={12} className="animate-spin" />
                      Generazione in corso…
                    </div>
                  ) : (b.html_path || b.docx_path) ? (
                    <>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Scarica come</p>
                      <div className="flex items-center gap-1">
                        {b.html_path && (
                          <button
                            onClick={() => downloadFromStorage(b.html_path, `Bilancio_${b.versione}.html`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-border text-xs rounded hover:bg-muted hover:border-primary transition-colors"
                            title="Web — apribile in qualsiasi browser"
                          >
                            <FileType size={12} /> HTML
                          </button>
                        )}
                        {b.docx_path && (
                          <button
                            onClick={() => downloadFromStorage(b.docx_path, `Bilancio_${b.versione}.doc`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-border text-xs rounded hover:bg-muted hover:border-primary transition-colors"
                            title="Microsoft Word"
                          >
                            <FileIcon size={12} /> DOC
                          </button>
                        )}
                        {b.html_path && (
                          <button
                            onClick={() => downloadAsPdf(b)}
                            disabled={pdfBusy === b.id}
                            className={cn(
                              "flex items-center gap-1 px-2.5 py-1.5 border text-xs rounded transition-colors",
                              pdfBusy === b.id
                                ? "border-blue-200 bg-blue-50 text-blue-700 cursor-wait"
                                : "border-border hover:bg-muted hover:border-primary"
                            )}
                            title="PDF generato dall'anteprima"
                          >
                            {pdfBusy === b.id ? (
                              <><Loader2 size={12} className="animate-spin" /> PDF…</>
                            ) : (
                              <><Download size={12} /> PDF</>
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <button onClick={onBack} className="px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted">
          ← Indietro
        </button>
      </div>
    </div>
  );
}
