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
