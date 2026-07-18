import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearReplayImageEvaluationMemoryCache,
  getReplayImageEvaluationCache,
  storeReplayImageEvaluationCache,
} from '../../../src/app/integrations/replay/replay-image-evaluation-cache';

describe('replay image evaluation cache', () => {
  beforeEach(() => clearReplayImageEvaluationMemoryCache());

  it('returns a cached evaluation only for its exact fingerprint', () => {
    storeReplayImageEvaluationCache('positioning-test', 'board-a', {
      score: 42,
    });

    expect(
      getReplayImageEvaluationCache<{ score: number }>(
        'positioning-test',
        'board-a',
      ),
    ).toEqual({ score: 42 });
    expect(
      getReplayImageEvaluationCache('positioning-test', 'board-b'),
    ).toBeNull();
  });
});
