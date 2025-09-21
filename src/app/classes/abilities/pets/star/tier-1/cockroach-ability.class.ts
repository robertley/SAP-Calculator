import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { SummonedCockroach } from "../../../../pets/hidden/summoned-cockroach.class";

export class CockroachAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'CockroachAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        const expToGain = this.level;

        const newCockroach = new SummonedCockroach(this.logService, this.abilityService, owner.parent, 1, 1, 0, 0);

        let summonResult = owner.parent.summonPet(newCockroach, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} summoned a 1/1 Cockroach.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            });

            let targetResp = owner.parent.getThis(newCockroach);
            targetResp.pet.increaseExp(expToGain);
            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} +${expToGain} exp.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): CockroachAbility {
        return new CockroachAbility(newOwner, this.logService, this.abilityService);
    }
}