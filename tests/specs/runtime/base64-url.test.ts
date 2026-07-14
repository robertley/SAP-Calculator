import { describe, expect, it } from 'vitest';
import {
  decodeBase64Url,
  encodeBase64Url,
} from '../../../src/app/runtime/base64-url';

describe('base64 URL encoding', () => {
  it('round-trips UTF-8 text without URL-unsafe characters', () => {
    const value = JSON.stringify({ name: 'Café 🐾 – “quoted”' });
    const encoded = encodeBase64Url(value);

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeBase64Url(encoded)).toBe(value);
  });

  it('handles payloads larger than the browser argument limit', () => {
    const value = `é🐾${'calculator'.repeat(10_000)}`;

    expect(decodeBase64Url(encodeBase64Url(value))).toBe(value);
  });

  it('continues to decode padded standard base64', () => {
    expect(decodeBase64Url('eyJuYW1lIjoiRmlzaCJ9')).toBe('{"name":"Fish"}');
  });
});
