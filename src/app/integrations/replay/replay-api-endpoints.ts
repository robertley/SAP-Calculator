import { environment } from 'environments/environment';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

type ReplayApiPath =
  | '/health'
  | '/replay-battle'
  | '/replays';

export function getReplayApiUrl(
  path: ReplayApiPath,
): string {
  return `${trimTrailingSlash(environment.replayApiBaseUrl)}${path}`;
}

export function getReplayTurnsApiUrl(replayId: string): string {
  const encodedReplayId = encodeURIComponent(String(replayId));
  return `${trimTrailingSlash(environment.replayApiBaseUrl)}/replays/${encodedReplayId}/turns`;
}

export function getSapLibraryReplayUrl(replayId: string): string {
  const baseUrl = trimTrailingSlash(environment.sapLibraryBaseUrl);
  const url = new URL(baseUrl);
  url.searchParams.set('replay', String(replayId));
  return url.toString();
}
