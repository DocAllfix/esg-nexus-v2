import { cn } from "@/lib/utils";
import {
  CheckCircle2, Clock, AlertTriangle, AlertOctagon,
  AlertCircle, Loader2
} from "lucide-react";

const configs = {
  // Engagement stati
  MATERIALITA_IN_CORSO: { label: "Materialità in corso", color: "bg-green-100 text-green-800 border-green-200" },
  DATI_VALIDAZIONE: { label: "Dati in validazione", color: "bg-teal-100 text-teal-800 border-teal-200" },
  BIL_PUBBLICATO: { label: "Bilancio pubblicato", color: "bg-gray-900 text-white border-gray-900" },
  CONTRATTO_FIRMATO: { label: "Contratto firmato", color: "bg-purple-100 text-purple-800 border-purple-200" },
  ACQUISIZIONE: { label: "In acquisizione", color: "bg-blue-100 text-blue-800 border-blue-200" },
  CRITICO: { label: "Critico", color: "bg-red-100 text-red-800 border-red-200", icon: AlertOctagon },
  SOSPESO: { label: "Sospeso", color: "bg-orange-100 text-orange-800 border-orange-200" },
  // Processi
  completata: { label: "Completata", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  in_corso: { label: "In corso", color: "bg-teal-100 text-teal-800 border-teal-200", icon: Loader2 },
  non_iniziata: { label: "Non iniziata", color: "bg-gray-100 text-gray-600 border-gray-200", icon: Clock },
  // Rischi
  CRITICO_R: { label: "Critico", color: "bg-red-100 text-red-800 border-red-200", icon: AlertOctagon },
  ALTO: { label: "Alto", color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle },
  MEDIO: { label: "Medio", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle },
  BASSO: { label: "Basso", color: "bg-lime-100 text-lime-800 border-lime-200", icon: CheckCircle2 },
  // KPI validazione
  validato: { label: "Validato", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  da_validare: { label: "Da validare", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  anomalia: { label: "Anomalia", color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  // Capitoli bilancio
  approvato: { label: "Approvato", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  revisione: { label: "In revisione", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  bozza: { label: "Bozza", color: "bg-gray-100 text-gray-600 border-gray-200" },
  // NPS
  PROMOTORE: { label: "Promotore", color: "bg-green-100 text-green-800 border-green-200" },
  PASSIVO: { label: "Passivo", color: "bg-amber-100 text-amber-800 border-amber-200" },
  DETRATTORE: { label: "Detrattore", color: "bg-red-100 text-red-800 border-red-200" },
  // Decisione
  GO: { label: "GO", color: "bg-green-100 text-green-800 border-green-200" },
  CONDIZIONATO: { label: "GO COND.", color: "bg-amber-100 text-amber-800 border-amber-200" },
  NOGO: { label: "NO GO", color: "bg-red-100 text-red-800 border-red-200" },
  // Standard
  GRI: { label: "GRI", color: "bg-blue-100 text-blue-800 border-blue-200" },
  CSRD_ESRS: { label: "CSRD/ESRS", color: "bg-purple-100 text-purple-800 border-purple-200" },
  ENTRAMBI: { label: "GRI + ESRS", color: "bg-teal-100 text-teal-800 border-teal-200" },
};

export default function StatusBadge({ status, label, className, size = "sm" }) {
  const config = configs[status] || { label: label || status, color: "bg-gray-100 text-gray-600 border-gray-200" };
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 border rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      config.color,
      className
    )}>
      {Icon && <Icon size={size === "sm" ? 11 : 13} />}
      {label || config.label}
    </span>
  );
}