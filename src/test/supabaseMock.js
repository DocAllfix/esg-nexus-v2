import { vi } from 'vitest';

// Builds a chainable supabase-js stub. Each .from(table) returns a builder
// whose chained calls return `this`. The terminal awaited value is supplied
// by tests via `setTableResponse(table, methodTag, response)`.
//
// Each test should call `resetSupabaseMock()` in beforeEach.
//
// Example:
//   setTableResponse('clienti', 'select', { data: [...], error: null });
//   setTableResponse('clienti', 'insert', { data: {...}, error: null });

const responses = new Map();
const calls = [];

function key(table, tag) {
  return `${table}::${tag}`;
}

export function setTableResponse(table, tag, response) {
  responses.set(key(table, tag), response);
}

export function getCalls() {
  return calls;
}

export function resetSupabaseMock() {
  responses.clear();
  calls.length = 0;
}

function makeBuilder(table) {
  const state = { tag: null };

  const builder = {
    select(...args) {
      state.tag ??= 'select';
      calls.push({ table, op: 'select', args });
      return builder;
    },
    insert(payload) {
      state.tag = 'insert';
      calls.push({ table, op: 'insert', payload });
      return builder;
    },
    update(payload) {
      state.tag = 'update';
      calls.push({ table, op: 'update', payload });
      return builder;
    },
    upsert(payload, opts) {
      state.tag = 'upsert';
      calls.push({ table, op: 'upsert', payload, opts });
      return builder;
    },
    delete() {
      state.tag = 'delete';
      calls.push({ table, op: 'delete' });
      return builder;
    },
    eq(col, val) {
      calls.push({ table, op: 'eq', col, val });
      return builder;
    },
    in(col, vals) {
      calls.push({ table, op: 'in', col, vals });
      return builder;
    },
    is(col, val) {
      calls.push({ table, op: 'is', col, val });
      return builder;
    },
    lt(col, val) { return builder; },
    lte(col, val) { return builder; },
    gte(col, val) { return builder; },
    like(col, val) { return builder; },
    order() { return builder; },
    limit() { return builder; },
    single() {
      return Promise.resolve(responses.get(key(table, state.tag)) ?? { data: null, error: null });
    },
    maybeSingle() {
      return Promise.resolve(responses.get(key(table, state.tag)) ?? { data: null, error: null });
    },
    then(onFulfilled, onRejected) {
      const result = responses.get(key(table, state.tag)) ?? { data: [], error: null };
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
  };

  return builder;
}

export const mockSupabase = {
  from: vi.fn((table) => makeBuilder(table)),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: { access_token: 'tok' } }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  })),
  removeChannel: vi.fn(),
};
