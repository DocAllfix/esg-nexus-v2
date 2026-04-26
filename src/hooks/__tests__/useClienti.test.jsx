import { describe, it, expect, beforeEach, vi } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import {
  mockSupabase,
  resetSupabaseMock,
  setTableResponse,
  getCalls,
} from '@/test/supabaseMock';

vi.mock('@/api/supabaseClient', () => ({ supabase: mockSupabase }));

import { useClienti } from '@/hooks/useClienti';
import { renderHookWithQuery } from '@/test/renderHook.jsx';

describe('useClienti', () => {
  beforeEach(() => {
    resetSupabaseMock();
    vi.clearAllMocks();
  });

  it('fetches clienti on mount', async () => {
    setTableResponse('clienti', 'select', {
      data: [{ id: 'c1', ragione_sociale: 'Acme' }],
      error: null,
    });

    const { result } = renderHookWithQuery(() => useClienti());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: 'c1', ragione_sociale: 'Acme' }]);
    expect(mockSupabase.from).toHaveBeenCalledWith('clienti');
  });

  it('create mutation injects user_id from auth.getUser', async () => {
    setTableResponse('clienti', 'select', { data: [], error: null });
    setTableResponse('clienti', 'insert', {
      data: { id: 'new-c', ragione_sociale: 'New' },
      error: null,
    });

    const { result } = renderHookWithQuery(() => useClienti());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.create.mutateAsync({ ragione_sociale: 'New' });
    });

    const insertCall = getCalls().find(c => c.op === 'insert');
    expect(insertCall).toBeDefined();
    expect(insertCall.payload).toMatchObject({
      ragione_sociale: 'New',
      user_id: 'test-user-id',
    });
  });
});
