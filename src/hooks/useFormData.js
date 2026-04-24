import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

export function useFormData(engagementId, formCode) {
  const qc = useQueryClient();

  const dataRef = useRef({});
  const pendingRef = useRef(false);
  const statusRef = useRef('non_iniziato');
  const timerRef = useRef(null);
  const tokenRef = useRef(null);

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
    pendingRef.current = false;
    const snapshot = { ...dataRef.current };
    setIsSaving(true);
    try {
      const { error } = await supabase.from('form_data').upsert(
        {
          engagement_id: engagementId,
          form_code: formCode,
          proc_code: `PROC-${formCode.substring(0, 2)}`,
          status: statusRef.current,
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
    }
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
  const total = rows.length;
  const completed = rows.filter((r) => r.status === 'completato').length;
  const progresso = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    statuses,
    progresso,
    isLoading: query.isLoading,
    error: query.error,
  };
}
