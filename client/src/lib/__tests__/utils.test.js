import { describe, it, expect } from 'vitest';
import formatHash from '../utils';

describe('formatHash', () => {
  it('should format a hash correctly', () => {
    const hash = '1234567890abcdef';
    const formatted = formatHash(hash);
    expect(formatted).toBe('123456...abcdef');
  });

  it('should handle empty hash', () => {
    const formatted = formatHash('');
    expect(formatted).toBe('N/A');
  });

  it('should handle null hash', () => {
    const formatted = formatHash(null);
    expect(formatted).toBe('N/A');
  });

  it('should handle undefined hash', () => {
    const formatted = formatHash(undefined);
    expect(formatted).toBe('N/A');
  });

  it('should handle hash shorter than 12 characters', () => {
    const hash = '123456';
    const formatted = formatHash(hash);
    expect(formatted).toBe('123456...123456');
  });
}); 