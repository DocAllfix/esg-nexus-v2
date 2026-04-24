import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const [
        engSummaryRes,
        fatturatoRes,
        rischiRes,
        kpiDashRes,
        ghgTotRes,
      ] = await Promise.all([
        supabase.from('v_engagement_summary').select('*'),
        supabase
          .from('v_fatturato_annuo')
          .select('*')
          .order('anno', { ascending: true }),
        supabase.from('rischi').select('id, score, categoria, engagement_id'),
        supabase.from('v_kpi_dashboard').select('*'),
        supabase.from('v_ghg_totali').select('*'),
      ]);

      if (engSummaryRes.error) throw engSummaryRes.error;
      if (fatturatoRes.error) throw fatturatoRes.error;
      if (rischiRes.error) throw rischiRes.error;
      if (kpiDashRes.error) throw kpiDashRes.error;
      if (ghgTotRes.error) throw ghgTotRes.error;

      const engagements = engSummaryRes.data ?? [];
      const fatturato = fatturatoRes.data ?? [];
      const rischi = rischiRes.data ?? [];
      const kpiDashboard = kpiDashRes.data ?? [];
      const ghgTotali = ghgTotRes.data ?? [];

      const engByStandard = engagements.reduce((acc, e) => {
        const k = e.standard ?? 'N/A';
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {});

      const engBySettore = engagements.reduce((acc, e) => {
        const k = e.cliente_settore ?? 'Altro';
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {});

      const rischiByCategoria = rischi.reduce((acc, r) => {
        const k = r.categoria ?? 'Altro';
        if (!acc[k]) acc[k] = { count: 0, scoreSum: 0 };
        acc[k].count += 1;
        acc[k].scoreSum += r.score ?? 0;
        return acc;
      }, {});

      const ghgByScope = ghgTotali.reduce((acc, g) => {
        const k = String(g.scope);
        acc[k] = (acc[k] ?? 0) + Number(g.totale_co2e_t ?? 0);
        return acc;
      }, {});

      const kpiByArea = kpiDashboard.reduce((acc, k) => {
        const key = k.area ?? 'X';
        if (!acc[key]) acc[key] = { num_kpi: 0, kpi_compilati: 0, kpi_target_raggiunti: 0 };
        acc[key].num_kpi += Number(k.num_kpi ?? 0);
        acc[key].kpi_compilati += Number(k.kpi_compilati ?? 0);
        acc[key].kpi_target_raggiunti += Number(k.kpi_target_raggiunti ?? 0);
        return acc;
      }, {});

      return {
        engagements,
        fatturato,
        rischi,
        kpiDashboard,
        ghgTotali,
        engByStandard,
        engBySettore,
        rischiByCategoria,
        ghgByScope,
        kpiByArea,
      };
    },
  });
}
