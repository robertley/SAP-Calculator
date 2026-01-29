import { describe, it, expect } from 'vitest';
import { AbilityQueueService } from '../src/app/services/ability/ability-queue.service';
import { ABILITY_PRIORITIES } from '../src/app/services/ability/ability-priorities';

describe('Ability Priority Order', () => {
    const queueService = new AbilityQueueService();

    it('ManaSnipe should have higher priority (lower number) than ThisDied', () => {
        const manaSnipePriority = queueService.getAbilityPriority('ManaSnipe' as any);
        const thisDiedPriority = queueService.getAbilityPriority('ThisDied' as any);

        expect(manaSnipePriority).toBe(24.5);
        expect(thisDiedPriority).toBe(25.6);
        expect(manaSnipePriority).toBeLessThan(thisDiedPriority);
    });

    it('GoldenRetrieverSummons should have expected priority', () => {
        const priority = queueService.getAbilityPriority('GoldenRetrieverSummons' as any);
        expect(priority).toBe(27);
    });

    it('Should not return 999 for valid triggers due to casing', () => {
        expect(queueService.getAbilityPriority('ManaSnipe' as any)).not.toBe(999);
        expect(queueService.getAbilityPriority('GoldenRetrieverSummons' as any)).not.toBe(999);
    });
});
