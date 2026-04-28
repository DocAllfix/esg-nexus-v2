import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

/**
 * Lista versioni del bilancio per un engagement (R1, R2, R3, ...).
 */
export function useBilanci(engagementId) {
  return useQuery({
    queryKey: ["bilanci", engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bilanci")
        .select("*")
        .eq("engagement_id", engagementId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!engagementId,
  });
}

/**
 * Mutation: invoca l'Edge Function `generate-bilancio` per generare
 * una nuova versione. Riceve { engagementId, versione } e restituisce
 * il record bilancio creato.
 */
export function useGenerateBilancio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ engagementId, versione }) => {
      const { data, error } = await supabase.functions.invoke("generate-bilancio", {
        body: { engagementId, versione },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["bilanci", vars.engagementId] });
    },
  });
}

/**
 * Genera una signed URL per scaricare un file dal bucket `bilanci`.
 * Restituisce stringa URL (valida 5 min) oppure null.
 */
export async function getBilancioFileUrl(path) {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from("bilanci")
    .createSignedUrl(path, 60 * 5); // 5 minuti
  if (error) {
    console.error("getBilancioFileUrl:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}
