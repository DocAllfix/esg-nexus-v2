import { describe, it, expect, beforeEach, vi } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import {
  mockSupabase,
  resetSupabaseMock,
  setTableResponse,
  getCalls,
} from '@/test/supabaseMock';

vi.mock('@/api/supabaseClient', () => ({ supabase: mockSupabase }));

import { useCreateEngagement } from '@/hooks/useEngagements';
import { renderHookWithQuery } from '@/test/renderHook.jsx';

describe('useCreateEngagement', () => {
  beforeEach(() => {
    resetSupabaseMock();
    vi.clearAllMocks();
  });

  it('inserts an engagement and exactly 8 engagement_fasi rows', async () => {
    setTableResponse('engagements', 'insert', {
      data: { id: 'eng-1', cliente_id: 'cl-1', anno_rendicontazione: 2026 },
      error: null,
    });
    setTableResponse('engagement_fasi', 'insert', { data: null, error: null });

    const { result } = renderHookWithQuery(() => useCreateEngagement());

    await act(async () => {
      await result.current.mutateAsync({
        cliente_id: 'cl-1',
        anno_rendicontazione: 2026,
        standard: 'GRI',
      });
    });

    const inserts = getCalls().filter(c => c.op === 'insert');
    const engInsert = inserts.find(c => c.table === 'engagements');
    const fasiInsert = inserts.find(c => c.table === 'engagement_fasi');

    expect(engInsert).toBeDefined();
    expect(engInsert.payload.user_id).toBe('test-user-id');
    expect(engInsert.payload.cliente_id).toBe('cl-1');

    expect(fasiInsert).toBeDefined();
    expect(Array.isArray(fasiInsert.payload)).toBe(true);
    expect(fasiInsert.payload).toHaveLength(8);

    const procCodes = fasiInsert.payload.map(f => f.proc_code);
    expect(procCodes).toEqual([
      'PROC-00', 'PROC-01', 'PROC-02', 'PROC-03',
      'PROC-04', 'PROC-05', 'PROC-06', 'PROC-07',
    ]);
    for (const fase of fasiInsert.payload) {
      expect(fase.engagement_id).toBe('eng-1');
      expect(fase.stato).toBe('non_iniziata');
    }
  });
});
