import { describe, it, expect } from 'vitest';
import { AbilityQueueService } from '../../../src/app/integrations/ability/ability-queue.service';
import { AbilityEvent } from '../../../src/app/domain/interfaces/ability-event.interface';
import { AbilityTrigger } from '../../../src/app/domain/entities/ability.class';

describe('Ability Priority Order', () => {
    it('ManaSnipe should have higher priority (lower number) than PostRemovalFaint', () => {
        const queueService = new AbilityQueueService();
        const manaSnipePriority = queueService.getAbilityPriority('ManaSnipe');
        const postRemovalPriority = queueService.getAbilityPriority('PostRemovalFaint');

        expect(manaSnipePriority).toBe(23);
        expect(postRemovalPriority).toBe(25);
        expect(manaSnipePriority).toBeLessThan(postRemovalPriority);
    });

    it('Should not return 999 for valid triggers due to casing', () => {
        const queueService = new AbilityQueueService();
        expect(queueService.getAbilityPriority('ManaSnipe')).not.toBe(999);
        expect(queueService.getAbilityPriority('GoldenRetrieverSummons')).not.toBe(999);
    });

    it('orders BeforeThisAttacks ahead of BeforeFriendAttacks regardless of pet attack', () => {
        const queueService = new AbilityQueueService();
        queueService.addEventToQueue(makeEvent('BeforeFriendAttacks', 50));
        queueService.addEventToQueue(makeEvent('BeforeThisAttacks', 1));

        expect(queueService.getNextHighestPriorityEvent()?.abilityType).toBe(
            'BeforeThisAttacks',
        );
    });

    it('uses pet attack priority within the non-self before-attack group', () => {
        const queueService = new AbilityQueueService();
        queueService.addEventToQueue(makeEvent('BeforeFriendAttacks', 1));
        queueService.addEventToQueue(makeEvent('BeforeFriendlyAttack', 50));

        expect(queueService.getNextHighestPriorityEvent()?.abilityType).toBe(
            'BeforeFriendlyAttack',
        );
    });

    it('orders ThisAttacked ahead of friend attack observers regardless of pet attack', () => {
        const observerTriggers: AbilityTrigger[] = [
            'FriendAttacked',
            'FriendAheadAttacked',
            'FriendlyAttacked',
        ];

        for (const observerTrigger of observerTriggers) {
            const queueService = new AbilityQueueService();
            queueService.addEventToQueue(makeEvent(observerTrigger, 50));
            queueService.addEventToQueue(makeEvent('ThisAttacked', 1));

            expect(queueService.getNextHighestPriorityEvent()?.abilityType).toBe(
                'ThisAttacked',
            );
        }
    });

    it('uses pet attack priority across all non-self after-attack observers', () => {
        const queueService = new AbilityQueueService();
        queueService.addEventToQueue(makeEvent('FriendAheadAttacked', 1));
        queueService.addEventToQueue(makeEvent('AnyoneAttack', 50));

        expect(queueService.getNextHighestPriorityEvent()?.abilityType).toBe(
            'AnyoneAttack',
        );
    });
});

function makeEvent(
    abilityType: AbilityTrigger,
    priority: number,
): AbilityEvent {
    return {
        abilityType,
        priority,
        callback: () => undefined,
    };
}



