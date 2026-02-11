import { environment } from 'environments/environment';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getReplayApiUrl(path: '/health' | '/replay-battle'): string {
  return `${trimTrailingSlash(environment.replayApiBaseUrl)}${path}`;
}
