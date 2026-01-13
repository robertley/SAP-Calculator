import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { shuffle } from "app/util/helper-functions";

export class SpinyBushViperAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Spiny Bush Viper Ability',
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
        const opponentPets = owner.parent.opponent.petArray.filter((pet) => pet && pet.alive);
        if (opponentPets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const targets = shuffle([...opponentPets]).slice(0, Math.min(2, opponentPets.length));
        const ownerPosition = owner.position ?? owner.savedPosition ?? 0;
        const damageLog: string[] = [];

        for (const target of targets) {
            const targetPosition = target.position ?? target.savedPosition ?? 0;
            const distance = Math.max(1, Math.abs(ownerPosition - targetPosition));
            const damage = Math.max(1, this.level) * distance;
            owner.dealDamage(target, damage);
            damageLog.push(`${damage} to ${target.name}`);
        }

        if (damageLog.length > 0) {
            this.logService.createLog({
                message: `${owner.name} dealt ${damageLog.join(' and ')}.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SpinyBushViperAbility {
        return new SpinyBushViperAbility(newOwner, this.logService);
    }
}
