import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const today = new Date();
      const in14 = new Date();
      in14.setDate(today.getDate() + 14);
      const toISO = (d) => d.toISOString().slice(0, 10);

      const [
        engagementsRes,
        rischiRes,
        scadenzeRes,
        azioniRes,
        eventiRes,
      ] = await Promise.all([
        supabase
          .from('engagements')
          .select('*, clienti(ragione_sociale, settore)')
          .in('stato', ['in_corso', 'avviato'])
          .order('created_at', { ascending: false }),
        supabase
          .from('rischi')
          .select('id, score, descrizione, engagement_id')
          .gte('score', 15),
        supabase
          .from('scadenze')
          .select('id, descrizione, data_scadenza, priorita, engagement_id')
          .eq('stato', 'pending')
          .gte('data_scadenza', toISO(today))
          .lte('data_scadenza', toISO(in14)),
        supabase
          .from('azioni_giorno')
          .select('*')
          .eq('data', toISO(today))
          .order('ordine', { ascending: true }),
        supabase
          .from('eventi_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (engagementsRes.error) throw engagementsRes.error;
      if (rischiRes.error) throw rischiRes.error;
      if (scadenzeRes.error) throw scadenzeRes.error;
      if (azioniRes.error) throw azioniRes.error;
      if (eventiRes.error) throw eventiRes.error;

      const engagements = engagementsRes.data ?? [];
      const rischiCritici = rischiRes.data ?? [];
      const scadenze = scadenzeRes.data ?? [];
      const azioni = azioniRes.data ?? [];
      const eventiRecenti = eventiRes.data ?? [];

      return {
        engAttivi: engagements.length,
        rischiCritici: rischiCritici.length,
        scadenzeCount: scadenze.length,
        azioni,
        eventiRecenti,
        engagements,
        rischi: rischiCritici,
        scadenze,
      };
    },
  });
}
