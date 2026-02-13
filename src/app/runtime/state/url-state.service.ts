import { Injectable } from '@angular/core';
import { REVERSE_KEY_MAP } from './url-state-key-map';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function expandKeys(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => expandKeys(item));
  }
  if (isRecord(data)) {
    const newObj: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      const newKey = REVERSE_KEY_MAP[key] || key;
      newObj[newKey] = expandKeys(data[key]);
    }
    return newObj;
  }
  return data;
}

function normalizeBase64Payload(payload: string): string {
  const base64 = payload
    .replace(/\s/g, '+')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  return `${base64}${'='.repeat(padLength)}`;
}

function decodeBase64Payload(payload: string): string {
  const binary = atob(normalizeBase64Payload(payload));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJsonPayload(payload: string): unknown {
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return JSON.parse(decodeURIComponent(payload)) as unknown;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UrlStateService {
  parseCalculatorStateFromUrl(): {
    state: Record<string, unknown> | null;
    error?: string;
  } {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(
      hash.startsWith('?') ? hash.slice(1) : hash,
    );
    const encodedData = params.get('c') || hashParams.get('c');

    if (!encodedData) {
      return { state: null };
    }

    try {
      const decodedData = decodeURIComponent(encodedData);
      const parsedState =
        decodedData.trim().startsWith('{') || decodedData.trim().startsWith('[')
          ? (JSON.parse(decodedData) as unknown)
          : parseJsonPayload(decodeBase64Payload(encodedData));

      const fullKeyJson = expandKeys(parsedState);
      return isRecord(fullKeyJson) ? { state: fullKeyJson } : { state: null };
    } catch {
      return {
        state: null,
        error: 'Failed to parse calculator state from URL.',
      };
    }
  }

  parseApiStateFromUrl(): {
    state: Record<string, unknown> | null;
    error?: string;
  } {
    const params = new URLSearchParams(window.location.search);
    const apiCode = params.get('code');

    if (!apiCode) {
      return { state: null };
    }

    try {
      const jsonData = JSON.parse(decodeURIComponent(apiCode)) as unknown;
      return isRecord(jsonData) ? { state: jsonData } : { state: null };
    } catch {
      return { state: null, error: 'Error parsing API data from URL.' };
    }
  }
}
