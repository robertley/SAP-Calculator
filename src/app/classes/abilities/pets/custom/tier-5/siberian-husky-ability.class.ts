import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { shuffle } from "app/util/helper-functions";

export class SiberianHuskyAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Siberian Husky Ability',
            owner: owner,
            triggers: ['EndTurn'],
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
        const owner = this.owner;
        const buff = this.level;
        const candidates = owner.parent.petArray.filter((friend) => {
            if (!friend || friend === owner || !friend.alive) {
                return false;
            }
            return friend.equipment == null || friend.equipment.equipmentClass !== 'shop';
        });
        if (candidates.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        shuffle(candidates);
        const targets = candidates.slice(0, 3);
        for (const target of targets) {
            target.increaseAttack(buff);
            target.increaseHealth(buff);
        }

        this.logService.createLog({
            message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${buff}/+${buff}.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SiberianHuskyAbility {
        return new SiberianHuskyAbility(newOwner, this.logService);
    }
}
