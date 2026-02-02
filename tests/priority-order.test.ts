import { describe, it, expect } from 'vitest';
import { AbilityQueueService } from '../src/app/services/ability/ability-queue.service';
import { ABILITY_PRIORITIES } from '../src/app/services/ability/ability-priorities';

describe('Ability Priority Order', () => {
    const queueService = new AbilityQueueService();

    it('ManaSnipe should have higher priority (lower number) than PostRemovalFaint', () => {
        const manaSnipePriority = queueService.getAbilityPriority('ManaSnipe' as any);
        const postRemovalPriority = queueService.getAbilityPriority('PostRemovalFaint' as any);

        expect(manaSnipePriority).toBe(23);
        expect(postRemovalPriority).toBe(25);
        expect(manaSnipePriority).toBeLessThan(postRemovalPriority);
    });

    it('Should not return 999 for valid triggers due to casing', () => {
        expect(queueService.getAbilityPriority('ManaSnipe' as any)).not.toBe(999);
        expect(queueService.getAbilityPriority('GoldenRetrieverSummons' as any)).not.toBe(999);
    });
});

