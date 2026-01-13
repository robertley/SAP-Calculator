import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { minExpForLevel } from "../../../../../util/leveling";

export class HoodedSealAbility extends Ability {
    private logService: LogService;
    private usesThisTurn = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Hooded Seal Ability',
            owner: owner,
            triggers: ['FriendTransformed', 'StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        if (context.trigger === 'StartTurn') {
            this.usesThisTurn = 0;
            return;
        }

        if (this.usesThisTurn >= 2) {
            this.triggerTigerExecution(context);
            return;
        }

        const transformedPet = context.triggerPet;
        if (!transformedPet) {
            this.triggerTigerExecution(context);
            return;
        }

        this.usesThisTurn++;
        const desiredExp = minExpForLevel(this.level);
        transformedPet.exp = Math.min(transformedPet.exp, desiredExp);
        transformedPet.resetAbilityUses();

        this.logService.createLog({
            message: `${this.owner.name} capped ${transformedPet.name} to level ${this.level}.`,
            type: 'ability',
            player: this.owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HoodedSealAbility {
        return new HoodedSealAbility(newOwner, this.logService);
    }
}
