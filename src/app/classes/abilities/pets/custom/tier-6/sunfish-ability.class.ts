import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SunfishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SunfishAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const { gameApi, tiger, pteranodon } = context;
        const turnNumber = gameApi?.turnNumber ?? 1;

        if (turnNumber % 2 === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const damage = this.level * 4;
        const targets = owner.getPetsAhead(5, true);
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        for (const target of targets) {
            owner.dealDamage(target, damage);
        }

        const names = targets.map(pet => pet.name).join(', ');
        this.logService.createLog({
            message: `${owner.name} hit ${names} ahead for ${damage} damage because turn ${turnNumber} is odd.`,
            type: 'ability',
            player: owner.parent,
            tiger,
            pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SunfishAbility {
        return new SunfishAbility(newOwner, this.logService);
    }
}
