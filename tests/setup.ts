import { beforeEach, afterEach, vi } from 'vitest';

// Ensure deterministic tests by fixing the system time
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-15T08:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});
