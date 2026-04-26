import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

// Fixed form counts per procedure — must match the FASI arrays in each TabProcXX/index.jsx
// and the FORMS_PER_PROC constant in the compute-engagement-progress Edge Function.
const PROC_FORM_TOTALS = {
  'PROC-00': 7,
  'PROC-01': 8,
  'PROC-02': 8,
  'PROC-03': 8,
  'PROC-04': 7,
  'PROC-05': 8,
  'PROC-06': 9,
  'PROC-07': 8,
};

export function useFormData(engagementId, formCode) {
  const qc = useQueryClient();

  const dataRef = useRef({});
  const pendingRef = useRef(false);
  const statusRef = useRef('non_iniziato');
  const timerRef = useRef(null);
  const tokenRef = useRef(null);
  const inFlightRef = useRef(null); // serialize concurrent flushes (M4)

  const [localData, setLocalData] = useState({});
  const [status, setStatus] = useState('non_iniziato');
  const [isSaving, setIsSaving] = useState(false);

  const query = useQuery({
    queryKey: ['form_data', engagementId, formCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_data')
        .select('*')
        .eq('engagement_id', engagementId)
        .eq('form_code', formCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!engagementId && !!formCode,
  });

  useEffect(() => {
    if (query.data) {
      const loadedData = query.data.data ?? {};
      const loadedStatus = query.data.status ?? 'non_iniziato';
      dataRef.current = loadedData;
      statusRef.current = loadedStatus;
      setLocalData(loadedData);
      setStatus(loadedStatus);
    }
  }, [query.data]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      tokenRef.current = data.session?.access_token ?? null;
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      tokenRef.current = session?.access_token ?? null;
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const flushToSupabase = useCallback(async () => {
    if (!pendingRef.current) return;

    // Serialize concurrent flushes: if one is in-flight, wait for it to
    // complete before starting the next. Without this, two HTTP POSTs from
    // back-to-back debounced flushes could arrive at Postgres out-of-order
    // and the older snapshot would overwrite the newer one (the upsert REPLACES
    // the JSONB `data` column, it doesn't merge it).
    if (inFlightRef.current) {
      await inFlightRef.current.catch(() => {});
      // After the wait, another caller may have already drained the pending
      // state (it set pendingRef = false before its await). Re-check.
      if (!pendingRef.current) return;
    }

    pendingRef.current = false;
    const snapshot = { ...dataRef.current };
    const snapshotStatus = statusRef.current;

    setIsSaving(true);
    const promise = (async () => {
      try {
        const { error } = await supabase.from('form_data').upsert(
          {
            engagement_id: engagementId,
            form_code: formCode,
            proc_code: `PROC-${formCode.substring(0, 2)}`,
            status: snapshotStatus,
            data: snapshot,
          },
          { onConflict: 'engagement_id,form_code' }
        );
        if (error) throw error;
        qc.invalidateQueries({
          queryKey: ['form_statuses', engagementId],
        });
      } finally {
        setIsSaving(false);
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = promise;
    return promise;
  }, [engagementId, formCode, qc]);

  const updateField = useCallback(
    (fieldName, value) => {
      dataRef.current = { ...dataRef.current, [fieldName]: value };
      pendingRef.current = true;
      setLocalData((prev) => ({ ...prev, [fieldName]: value }));
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flushToSupabase();
      }, 1000);
    },
    [flushToSupabase]
  );

  const updateStatus = useCallback(
    (newStatus) => {
      statusRef.current = newStatus;
      pendingRef.current = true;
      setStatus(newStatus);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flushToSupabase();
      }, 500);
    },
    [flushToSupabase]
  );

  const saveForm = useCallback(async () => {
    clearTimeout(timerRef.current);
    pendingRef.current = true;
    await flushToSupabase();
  }, [flushToSupabase]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if (pendingRef.current) {
        pendingRef.current = false;
        const snapshot = { ...dataRef.current };
        const payload = JSON.stringify({
          engagement_id: engagementId,
          form_code: formCode,
          proc_code: `PROC-${formCode.substring(0, 2)}`,
          status: statusRef.current,
          data: snapshot,
        });
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const token = tokenRef.current;
        fetch(`${url}/rest/v1/form_data?on_conflict=engagement_id,form_code`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${token || key}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: payload,
        });
      }
    };
  }, [engagementId, formCode]);

  useEffect(() => {
    const handler = () => {
      if (pendingRef.current) flushToSupabase();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [flushToSupabase]);

  return {
    data: localData,
    status,
    isLoading: query.isLoading,
    isSaving,
    updateField,
    updateStatus,
    saveForm,
  };
}

export function useFormDataReadonly(engagementId, formCode) {
  const query = useQuery({
    queryKey: ['form_data', engagementId, formCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_data')
        .select('*')
        .eq('engagement_id', engagementId)
        .eq('form_code', formCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!engagementId && !!formCode,
  });
  return query.data?.data ?? {};
}

export function useFormStatuses(engagementId, procCode) {
  const query = useQuery({
    queryKey: ['form_statuses', engagementId, procCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_data')
        .select('form_code, status')
        .eq('engagement_id', engagementId)
        .eq('proc_code', procCode);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!engagementId && !!procCode,
  });

  const rows = query.data ?? [];
  const statuses = rows.reduce((acc, r) => {
    acc[r.form_code] = r.status;
    return acc;
  }, {});

  // Use fixed denominator from lookup — same formula as the edge function:
  // completed=1.0, in_corso=0.5. Fallback to rows.length only if proc unknown.
  const totalForms = PROC_FORM_TOTALS[procCode] ?? rows.length;
  const completati = rows.filter((r) => r.status === 'completato').length;
  const inCorso    = rows.filter((r) => r.status === 'in_corso').length;
  const weighted   = completati + inCorso * 0.5;
  const progresso  = totalForms > 0
    ? Math.min(100, Math.round((weighted / totalForms) * 100))
    : 0;

  return {
    statuses,
    progresso,
    isLoading: query.isLoading,
    error: query.error,
  };
}
