import { describe, it, expect } from 'vitest';
import { sanitizeEvidenceData } from './sanitize';

describe('sanitizeEvidenceData', () => {
  it('should allow valid primitives', () => {
    const input = {
      a: 'string',
      b: 123,
      c: true,
      d: null
    };
    const result = sanitizeEvidenceData(input);
    expect(result).toEqual(input);
  });

  it('should convert objects and arrays to strings', () => {
    const input = {
      arr: [1, 2, 3],
      obj: { key: 'value' }
    };
    const result = sanitizeEvidenceData(input);
    expect(result).toEqual({
      arr: '[1,2,3]',
      obj: '{"key":"value"}'
    });
  });

  it('should ignore prototype pollution keys', () => {
    const input = JSON.parse('{"__proto__": {"admin": true}, "constructor": {"prototype": {"admin": true}}, "normal": "value"}');
    const result = sanitizeEvidenceData(input);

    expect(result).toEqual({ normal: 'value' });
    expect(result.__proto__).not.toEqual({ admin: true });
  });

  it('should handle non-object inputs', () => {
    expect(sanitizeEvidenceData('string')).toEqual({ data: 'string' });
    expect(sanitizeEvidenceData(123)).toEqual({ data: '123' });
    expect(sanitizeEvidenceData(null)).toEqual({ data: 'null' });
  });
});
