import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WinterSpiritAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WinterSpiritAbility',
            owner: owner,
            triggers: ['EndTurn'],
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
        const targets = owner.getPetsAhead(2);
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const manaGain = this.level * 5;
        const names = [];
        for (const target of targets) {
            target.increaseMana(manaGain);
            names.push(target.name);
        }

        this.logService.createLog({
            message: `${owner.name} gave ${names.join(', ')} +${manaGain} mana at end of turn.`,
            type: 'ability',
            player: owner.parent,
            tiger,
            pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WinterSpiritAbility {
        return new WinterSpiritAbility(newOwner, this.logService);
    }
}
