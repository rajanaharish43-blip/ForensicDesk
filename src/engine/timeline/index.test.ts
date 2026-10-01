import { describe, it, expect } from 'vitest';
import { normalizeTimestamp } from './index';

describe('normalizeTimestamp', () => {
  it('returns 0 for undefined, null, or empty string', () => {
    expect(normalizeTimestamp(undefined)).toBe(0);
    // @ts-expect-error - testing invalid runtime input
    expect(normalizeTimestamp(null)).toBe(0);
    expect(normalizeTimestamp('')).toBe(0);
  });

  it('converts Unix timestamp in seconds to milliseconds', () => {
    // 1696140540 seconds -> 1696140540000 milliseconds
    expect(normalizeTimestamp(1696140540)).toBe(1696140540000);
    expect(normalizeTimestamp('1696140540')).toBe(1696140540000);
  });

  it('preserves Unix timestamp in milliseconds', () => {
    // 1696140540000 milliseconds -> 1696140540000 milliseconds
    expect(normalizeTimestamp(1696140540000)).toBe(1696140540000);
    expect(normalizeTimestamp('1696140540000')).toBe(1696140540000);
  });

  it('parses valid ISO date strings to milliseconds', () => {
    const isoString = '2023-10-01T06:09:00.000Z';
    const expectedMs = Date.parse(isoString);
    expect(normalizeTimestamp(isoString)).toBe(expectedMs);
  });

  it('parses valid common date formats to milliseconds', () => {
    const dateString = '10/01/2023';
    const expectedMs = Date.parse(dateString);
    expect(normalizeTimestamp(dateString)).toBe(expectedMs);
  });

  it('returns 0 for unparseable strings', () => {
    expect(normalizeTimestamp('invalid-date')).toBe(0);
    expect(normalizeTimestamp('not-a-number')).toBe(0);
  });
});
