import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TroutAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Trout Ability',
            owner: owner,
            triggers: ['FriendSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const soldPet = context.triggerPet;

        if (!soldPet || soldPet.sellValue < 3) {
            this.triggerTigerExecution(context);
            return;
        }

        const attackGain = Math.max(1, this.level);
        const healthGain = attackGain * 2;
        owner.increaseAttack(attackGain);
        owner.increaseHealth(healthGain);

        this.logService.createLog({
            message: `${owner.name} gained +${attackGain}/+${healthGain} after ${soldPet.name} was sold.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TroutAbility {
        return new TroutAbility(newOwner, this.logService);
    }
}
