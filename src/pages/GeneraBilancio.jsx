import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataGuard from "@/components/common/DataGuard";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { useFormData } from "@/hooks/useFormData";
import WizardNav from "@/components/bilancio/WizardNav";
import StepVerifica from "@/components/bilancio/StepVerifica";
import StepIdentificazione from "@/components/bilancio/StepIdentificazione";
import StepIndici from "@/components/bilancio/StepIndici";
import StepCapitoli from "@/components/bilancio/StepCapitoli";
import StepAnteprima from "@/components/bilancio/StepAnteprima";
import StepGenera from "@/components/bilancio/StepGenera";
import { atom } from "@/lib/bilancio/extractors";

export default function GeneraBilancio() {
  const { id: engagementId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { data: ctx, isLoading, error } = useEngagementContext(engagementId);
  const { data: identificazione } = useFormData(engagementId, "08A");

  // Computa quali step sono "completed" (con dati minimi)
  const completedSteps = useMemo(() => {
    if (!ctx) return [];
    const done = [];
    // Step 1 — sempre completato dopo aver visto i dati
    if (atom.ragioneSociale(ctx)) done.push(1);
    // Step 2 — denom + framework selezionati
    if (identificazione?.framework || ctx.engagement?.standard) done.push(2);
    // Step 3-4-5 — opzionali, considerati "fatti" se l'utente li visita
    return done;
  }, [ctx, identificazione]);

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Identificazione effettiva (forma + default da engagement)
  const effectiveIdent = useMemo(() => {
    if (!ctx) return {};
    return {
      codice_bilancio: identificazione?.codice_bilancio ?? ctx.engagement?.codice_progetto,
      anno_rendicontazione: identificazione?.anno_rendicontazione ?? ctx.engagement?.anno_rendicontazione,
      denominazione: identificazione?.denominazione ?? atom.ragioneSociale(ctx),
      periodo: identificazione?.periodo ?? atom.periodoRendicontazione(ctx),
      data_pubblicazione: identificazione?.data_pubblicazione,
      framework: identificazione?.framework ?? ctx.engagement?.standard,
      contatto: identificazione?.contatto,
      note_copertina: identificazione?.note_copertina,
    };
  }, [ctx, identificazione]);

  return (
    <DataGuard data={ctx} isLoading={isLoading} error={error}>
      {ctx && (
        <div>
          <PageHeader
            title="Genera Bilancio di Sostenibilità"
            subtitle={`${atom.ragioneSociale(ctx) ?? "—"} · Anno ${ctx.engagement?.anno_rendicontazione ?? "—"} · ${ctx.engagement?.codice_progetto ?? ""}`}
            breadcrumbs={[
              { label: "Engagement", to: "/engagements" },
              { label: ctx.engagement?.codice_progetto ?? "—", to: `/engagements/${engagementId}` },
              { label: "Genera bilancio" },
            ]}
            actions={
              <button
                onClick={() => navigate(`/engagements/${engagementId}`)}
                className="flex items-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted"
              >
                <ArrowLeft size={14} /> Torna all'engagement
              </button>
            }
          />

          <div className="rounded-lg overflow-hidden border border-border mb-5">
            <WizardNav currentStep={step} onStepChange={setStep} completedSteps={completedSteps} />
          </div>

          {step === 1 && <StepVerifica ctx={ctx} onNext={goNext} />}
          {step === 2 && (
            <StepIdentificazione
              engagementId={engagementId}
              ctx={ctx}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepIndici
              engagementId={engagementId}
              ctx={ctx}
              identificazione={effectiveIdent}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <StepCapitoli
              engagementId={engagementId}
              ctx={ctx}
              identificazione={effectiveIdent}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <StepAnteprima
              engagementId={engagementId}
              ctx={ctx}
              identificazione={effectiveIdent}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 6 && (
            <StepGenera
              engagementId={engagementId}
              ctx={ctx}
              identificazione={effectiveIdent}
              onBack={goBack}
            />
          )}
        </div>
      )}
    </DataGuard>
  );
}
