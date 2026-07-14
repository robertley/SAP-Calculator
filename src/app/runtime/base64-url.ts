const BYTE_CHUNK_SIZE = 0x8000;

function normalizeBase64Url(value: string): string {
  const base64 = value
    .replace(/\s/g, '+')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  return `${base64}${'='.repeat(padLength)}`;
}

export function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let index = 0; index < bytes.length; index += BYTE_CHUNK_SIZE) {
    binary += String.fromCharCode(
      ...bytes.subarray(index, index + BYTE_CHUNK_SIZE),
    );
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function decodeBase64Url(value: string): string {
  const binary = atob(normalizeBase64Url(value));
  const bytes = Uint8Array.from(binary, (character) =>
    character.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}
