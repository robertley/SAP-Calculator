import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TarasqueAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Tarasque Ability',
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
        const percentIndex = Math.min(Math.max(owner.level - 1, 0), 2);
        const percents = [0.25, 0.5, 0.75];
        const percent = percents[percentIndex];

        const pets = owner.parent.petArray.filter((pet) => pet && pet.alive);
        if (pets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        let totalAttack = 0;
        let totalHealth = 0;
        for (const pet of pets) {
            const attackReduction = Math.floor(pet.attack * percent);
            const healthReduction = Math.floor(pet.health * percent);
            pet.attack = Math.max(1, pet.attack - attackReduction);
            pet.health = Math.max(1, pet.health - healthReduction);
            totalAttack += attackReduction;
            totalHealth += healthReduction;
        }

        const attackPerPet = Math.floor(totalAttack / pets.length);
        const healthPerPet = Math.floor(totalHealth / pets.length);
        const attackRemainder = totalAttack % pets.length;
        const healthRemainder = totalHealth % pets.length;

        for (let i = 0; i < pets.length; i++) {
            const pet = pets[i];
            let attackGain = attackPerPet + (i < attackRemainder ? 1 : 0);
            let healthGain = healthPerPet + (i < healthRemainder ? 1 : 0);
            if (attackGain > 0) {
                pet.increaseAttack(attackGain);
            }
            if (healthGain > 0) {
                pet.increaseHealth(healthGain);
            }
        }

        this.logService.createLog({
            message: `${owner.name} redistributed ${totalAttack}/${totalHealth} stats across ${pets.length} pets.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TarasqueAbility {
        return new TarasqueAbility(newOwner, this.logService);
    }
}
