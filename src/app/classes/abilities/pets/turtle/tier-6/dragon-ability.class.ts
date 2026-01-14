import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class DragonAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'DragonAbility',
            owner: owner,
            triggers: ['Tier1FriendBought'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 4,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const buff = this.level;
        const targets = owner.parent.petArray.filter((pet) => pet && pet.alive);
        if (targets.length === 0) {
            return;
        }

        for (const pet of targets) {
            pet.increaseAttack(buff);
            pet.increaseHealth(buff);
        }

        this.logService.createLog({
            message: `${owner.name} gave friends +${buff} attack and +${buff} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger
        });
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DragonAbility {
        return new DragonAbility(newOwner, this.logService, this.abilityService);
    }
}
