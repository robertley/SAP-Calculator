import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class MalteseAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Maltese Ability',
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
        const owner = this.owner;
        const player = owner.parent;
        const targetFriend = owner.petBehind();
        if (!targetFriend) {
            this.triggerTigerExecution(context);
            return;
        }

        const trumpetsAvailable = player.trumpets;
        if (trumpetsAvailable > 0) {
            player.spendTrumpets(trumpetsAvailable, owner, context.pteranodon);
        }

        const baseMana = 3 * this.level;
        const perTrumpet = this.level;
        const totalMana = baseMana + trumpetsAvailable * perTrumpet;
        targetFriend.increaseMana(totalMana);

        this.logService.createLog({
            message: `${owner.name} spent ${trumpetsAvailable} trumpets to give ${targetFriend.name} +${totalMana} mana.`,
            type: 'ability',
            player: player,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MalteseAbility {
        return new MalteseAbility(newOwner, this.logService);
    }
}
