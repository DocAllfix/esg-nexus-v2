import { describe, it, expect, beforeEach, vi } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import {
  mockSupabase,
  resetSupabaseMock,
  setTableResponse,
  getCalls,
} from '@/test/supabaseMock';

vi.mock('@/api/supabaseClient', () => ({ supabase: mockSupabase }));

// jsdom does not implement fetch by default; the unmount cleanup branch
// in useFormData calls fetch with keepalive. Stub it to avoid noise.
globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

import { useFormData } from '@/hooks/useFormData';
import { renderHookWithQuery } from '@/test/renderHook.jsx';

describe('useFormData', () => {
  beforeEach(() => {
    resetSupabaseMock();
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('debounces multiple updateField calls into a single upsert with the merged snapshot', async () => {
    setTableResponse('form_data', 'select', { data: null, error: null });
    setTableResponse('form_data', 'upsert', { data: null, error: null });

    const { result } = renderHookWithQuery(() =>
      useFormData('eng-1', '00A')
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateField('a', 1);
      result.current.updateField('b', 2);
      result.current.updateField('c', 3);
    });

    // Advance past 1s debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    const upserts = getCalls().filter(c => c.op === 'upsert');
    expect(upserts.length).toBe(1);

    const payload = upserts[0].payload;
    expect(payload.engagement_id).toBe('eng-1');
    expect(payload.form_code).toBe('00A');
    expect(payload.proc_code).toBe('PROC-00');
    expect(payload.data).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('derives proc_code from formCode prefix (PROC-XX)', async () => {
    setTableResponse('form_data', 'select', { data: null, error: null });
    setTableResponse('form_data', 'upsert', { data: null, error: null });

    const { result } = renderHookWithQuery(() =>
      useFormData('eng-2', '07G')
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateField('x', 'y');
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    const upsert = getCalls().find(c => c.op === 'upsert');
    expect(upsert.payload.proc_code).toBe('PROC-07');
  });
});
