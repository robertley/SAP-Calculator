import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LuscaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Lusca Ability',
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
        const manaSpent = owner.mana;
        if (manaSpent <= 0) {
            this.triggerTigerExecution(context);
            return;
        }

        owner.mana = 0;
        const opponent = owner.parent.opponent;
        const targetResp = opponent.getRandomPets(this.level, [], false, false, owner);
        const targets = targetResp.pets;
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        for (const target of targets) {
            const reduction = manaSpent;
            const attackAfter = Math.max(0, target.attack - reduction);
            const healthAfter = Math.max(0, target.health - reduction);
            target.attack = attackAfter;
            target.health = Math.max(1, healthAfter);
        }

        this.logService.createLog({
            message: `${owner.name} spent ${manaSpent} mana and drained ${targets.map((pet) => pet.name).join(', ')}.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LuscaAbility {
        return new LuscaAbility(newOwner, this.logService);
    }
}
