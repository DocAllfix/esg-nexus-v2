import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { loadEngagementContext } from "@/lib/bilancio/extractors";

/**
 * Carica TUTTO il ctx di un engagement per la generazione bilancio.
 * Risultato: { engagement, cliente, forms{}, iro[] }
 *
 * Usato dal wizard Genera Bilancio per alimentare extractor lato client
 * (anteprima live, copertura, validazioni).
 */
export function useEngagementContext(engagementId) {
  return useQuery({
    queryKey: ["engagement_context", engagementId],
    queryFn: () => loadEngagementContext(supabase, engagementId),
    enabled: !!engagementId,
    staleTime: 30 * 1000, // 30s — i form sono già cacheati altrove con useFormData
  });
}
