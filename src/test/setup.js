import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Stub env vars so @/api/supabaseClient module load doesn't throw on import
import.meta.env.VITE_SUPABASE_URL ??= 'https://test.supabase.co';
import.meta.env.VITE_SUPABASE_ANON_KEY ??= 'test-anon-key';
