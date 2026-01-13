import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PeanutButter } from "../../../../equipment/hidden/peanut-butter";

export class WalrusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WalrusAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const targetsResp = owner.parent.getRandomPets(this.level, [owner], false, false, owner);
        const targets = targetsResp.pets;

        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const names = [];
        for (const target of targets) {
            target.givePetEquipment(new PeanutButter());
            names.push(target.name);
        }

        this.logService.createLog({
            message: `${owner.name} gave Peanut Butter to ${names.join(', ')} on faint.`,
            type: 'ability',
            player: owner.parent,
            tiger,
            pteranodon,
            randomEvent: targetsResp.random
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WalrusAbility {
        return new WalrusAbility(newOwner, this.logService);
    }
}
