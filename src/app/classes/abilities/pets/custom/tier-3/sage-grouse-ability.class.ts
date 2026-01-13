import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SageGrouseAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Sage-Grouse Ability',
            owner: owner,
            triggers: ['ThisSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const player = owner.parent;
        const strawberry = owner.equipment?.name;

        if (strawberry !== 'Strawberry') {
            this.triggerTigerExecution(context);
            return;
        }

        owner.removePerk(true);

        const gainGold = 3;
        (player as any).gold = (player as any).gold ?? 0;
        (player as any).gold += gainGold;

        this.logService.createLog({
            message: `${owner.name} sold and removed Strawberry to gain +${gainGold} gold.`,
            type: 'ability',
            player: player,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): SageGrouseAbility {
        return new SageGrouseAbility(newOwner, this.logService);
    }
}
