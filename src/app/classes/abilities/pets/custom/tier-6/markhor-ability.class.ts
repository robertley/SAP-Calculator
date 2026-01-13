import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class MarkhorAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MarkhorAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const { tiger, pteranodon } = context;

        const player = owner.parent;
        if (player.trumpets < 4) {
            this.triggerTigerExecution(context);
            return;
        }

        const targets = player.petArray.filter(pet => pet && pet !== owner && pet.alive);
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        player.trumpets -= 4;
        const totalAttack = this.level * 4;
        const totalHealth = this.level * 4;
        const attackPerPet = Math.floor(totalAttack / targets.length);
        const healthPerPet = Math.floor(totalHealth / targets.length);
        const attackRemainder = totalAttack - attackPerPet * targets.length;
        const healthRemainder = totalHealth - healthPerPet * targets.length;

        for (let i = 0; i < targets.length; i++) {
            const pet = targets[i];
            const extraAttack = i < attackRemainder ? 1 : 0;
            const extraHealth = i < healthRemainder ? 1 : 0;
            pet.increaseAttack(attackPerPet + extraAttack);
            pet.increaseHealth(healthPerPet + extraHealth);
        }

        this.logService.createLog({
            message: `${owner.name} spent 4 trumpets to grant ${totalAttack}/${totalHealth} evenly among ${targets.length} friends.`,
            type: 'ability',
            player: player,
            tiger,
            pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MarkhorAbility {
        return new MarkhorAbility(newOwner, this.logService);
    }
}
