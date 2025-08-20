import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});
