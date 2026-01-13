import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GreatPotooAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Great Potoo Ability',
            owner: owner,
            triggers: ['AnyoneHurt'],
            abilityType: 'Pet',
            native: true,
            maxUses: 5,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi } = context;
        const owner = this.owner;

        // "If nobody has attacked" logic
        // We check if the first physical attack has happened yet.
        const hasAnyoneAttacked = gameApi.FirstNonJumpAttackHappened === true;

        if (!hasAnyoneAttacked) {

            const healthBuff = 2 * this.level;
            owner.increaseHealth(healthBuff);

            this.logService.createLog({
                message: `${owner.name} gained +${healthBuff} health from AnyoneHurt (before any attacks).`,
                type: 'ability',
                player: owner.parent
            });
        }

        this.triggerTigerExecution(context);
    }


    override copy(newOwner: Pet): GreatPotooAbility {
        return new GreatPotooAbility(newOwner, this.logService);
    }
}
