import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class JackalAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Jackal Ability',
            owner: owner,
            triggers: ['AnyoneFlung'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const movedPet = context.triggerPet;
        if (!movedPet || movedPet !== owner) {
            return;
        }

        const statTargets = [13, 26, 39];
        const newValue = statTargets[Math.min(Math.max(this.level - 1, 0), statTargets.length - 1)];
        owner.attack = newValue;
        owner.health = newValue;

        this.logService.createLog({
            message: `${owner.name} was flung and reset to ${newValue}/${newValue}.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): JackalAbility {
        return new JackalAbility(newOwner, this.logService);
    }
}
