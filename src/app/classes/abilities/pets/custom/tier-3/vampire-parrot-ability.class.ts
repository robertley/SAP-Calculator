import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class VampireParrotAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Vampire Parrot Ability',
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
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        const eligiblePets = owner.parent.petArray.filter(pet => pet.alive && pet.equipment);
        const uniqueAilments = new Set<string>();

        for (const pet of eligiblePets) {
            const equipmentClass = (pet.equipment as any).equipmentClass;
            if (equipmentClass === 'ailment-attack' ||
                equipmentClass === 'ailment-defense' ||
                equipmentClass === 'ailment-other') {
                uniqueAilments.add(pet.equipment.name);
            }
        }

        const count = uniqueAilments.size;
        if (count === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const attackPerPet = this.level;
        const healthPerPet = this.level * 2;
        const attackBuff = count * attackPerPet;
        const healthBuff = count * healthPerPet;
        owner.increaseAttack(attackBuff);
        owner.increaseHealth(healthBuff);

        this.logService.createLog({
            message: `${owner.name} gained +${attackBuff}/+${healthBuff} (+${attackPerPet}/+${healthPerPet} per unique ailment) from ${count} friendly pets with different ailments.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): VampireParrotAbility {
        return new VampireParrotAbility(newOwner, this.logService);
    }
}
