import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WaspAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Wasp Ability',
            owner: owner,
            triggers: ['ShopUpgrade'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const multiplier = 0.5 * this.level;
        const attackGain = Math.floor(owner.attack * multiplier);

        if (attackGain > 0) {
            owner.increaseAttack(attackGain);

            this.logService.createLog({
                message: `${owner.name} gained +${attackGain} attack from Shop Upgrade.`,
                type: 'ability',
                player: owner.parent
            });
        }
    }

    override copy(newOwner: Pet): WaspAbility {
        return new WaspAbility(newOwner, this.logService);
    }
}