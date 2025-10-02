import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class TelevisionAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TelevisionAbility',
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
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Television toy behavior (onBreak effect)
        let power = this.level * 2;
        let targetsResp = owner.parent.getAll(false, owner, true);
        let targets = targetsResp.pets;
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
                randomEvent: targetsResp.random
            })
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TelevisionAbility {
        return new TelevisionAbility(newOwner, this.logService);
    }
}