import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TunaAbility extends Ability {
    private logService: LogService;
    private timesHurtOverride: number | null;

    constructor(owner: Pet, logService: LogService, timesHurtOverride?: number) {
        super({
            name: 'TunaAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.timesHurtOverride = timesHurtOverride ?? null;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let totalHurt = this.timesHurtOverride ?? owner.timesHurt;
        for (let i = 0; i < totalHurt; i++) {
            const targetResp = owner.parent.getRandomPet([owner], true, false, true, owner);

            if (targetResp.pet == null) {
                continue;
            }

            const buffAmount = this.level;

            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            targetResp.pet.increaseAttack(buffAmount);
            targetResp.pet.increaseHealth(buffAmount);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TunaAbility {
        return new TunaAbility(newOwner, this.logService, this.timesHurtOverride ?? this.owner.timesHurt);
    }
}
