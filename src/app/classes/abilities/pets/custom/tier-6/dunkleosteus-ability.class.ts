import { cloneDeep } from "lodash";
import { Ability, AbilityContext } from "../../../../ability.class";
import { Equipment } from "../../../../equipment.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DunkleosteusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Dunkleosteus Ability',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const ailment = owner.equipment;
        if (!ailment || !this.isAilmentEquipment(ailment)) {
            this.triggerTigerExecution(context);
            return;
        }

        const opponentPets = owner.parent.opponent.petArray.filter((pet) => pet && pet.alive);
        if (opponentPets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const copiedAilment = cloneDeep(ailment);
        owner.removePerk(true);

        const targets = opponentPets.slice(0, Math.min(this.level, opponentPets.length));
        for (const target of targets) {
            const ailmentClone = cloneDeep(copiedAilment);
            ailmentClone.multiplier += this.level - 1;
            target.givePetEquipment(ailmentClone);
        }

        const effectNotes = ['.', ' twice for double effect.', ' thrice for triple effect.'];
        const message = `${owner.name} moved ${copiedAilment.name} to ${targets.map((pet) => pet.name).join(', ')}${effectNotes[Math.min(this.level, effectNotes.length) - 1]}`;

        this.logService.createLog({
            message,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    private isAilmentEquipment(equipment: Equipment): boolean {
        return equipment.equipmentClass === 'ailment-attack'
            || equipment.equipmentClass === 'ailment-defense'
            || equipment.equipmentClass === 'ailment-other';
    }

    copy(newOwner: Pet): DunkleosteusAbility {
        return new DunkleosteusAbility(newOwner, this.logService);
    }
}
