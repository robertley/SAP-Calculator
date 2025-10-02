import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class MammothAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MammothAbility',
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
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power = this.level * 2;
        let targetResp = owner.parent.getAll(false, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let pet of targets) {
            pet.increaseAttack(power);
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MammothAbility {
        return new MammothAbility(newOwner, this.logService);
    }
}