import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "../../../../../interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "../../../../../services/log.service";
import { PetService } from "../../../../../services/pet/pet.service";

export class AbominationAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'AbominationAbility',
            owner: owner,
            triggers: ['EndTurn', 'SpecialEndTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        const swallowSpots = this.level;
        const orderedSwallowedPets: Array<{ name?: string | null; level: number; timesHurt: number; belugaSwallowedPet?: string | null }> = [
            {
                name: owner.abominationSwallowedPet1,
                level: owner.abominationSwallowedPet1Level ?? 1,
                timesHurt: owner.abominationSwallowedPet1TimesHurt ?? 0,
                belugaSwallowedPet: owner.abominationSwallowedPet1BelugaSwallowedPet ?? null
            },
            {
                name: owner.abominationSwallowedPet2,
                level: owner.abominationSwallowedPet2Level ?? 1,
                timesHurt: owner.abominationSwallowedPet2TimesHurt ?? 0,
                belugaSwallowedPet: owner.abominationSwallowedPet2BelugaSwallowedPet ?? null
            },
            {
                name: owner.abominationSwallowedPet3,
                level: owner.abominationSwallowedPet3Level ?? 1,
                timesHurt: owner.abominationSwallowedPet3TimesHurt ?? 0,
                belugaSwallowedPet: owner.abominationSwallowedPet3BelugaSwallowedPet ?? null
            }
        ].filter((pet): pet is { name: string; level: number; timesHurt: number; belugaSwallowedPet: string | null } => pet.name != null);
        const swallowedPets = orderedSwallowedPets.slice(0, swallowSpots);
        // Tiger repeats only the first swallowed pet's ability.
        let executedSwallowedPets = swallowedPets;
        if (tiger && swallowedPets.length > 0) {
            executedSwallowedPets = swallowedPets.slice(0, 1);
        }
        for (let swallowedPet of executedSwallowedPets) {
            if (!swallowedPet.name) {
                continue;
            }
            const swallowedName = swallowedPet.name;
            let copyPet = this.petService.createPet({
                attack: 0,
                health: 0,
                mana: 0,
                equipment: null,
                name: swallowedName,
                exp: 0,
                timesHurt: swallowedPet.timesHurt ?? 0,
                belugaSwallowedPet: swallowedName === 'Beluga Whale'
                    ? swallowedPet.belugaSwallowedPet ?? undefined
                    : undefined
            }, owner.parent);

            if (!copyPet) {
                continue;
            }

            if (swallowedName === 'Beluga Whale') {
                owner.belugaSwallowedPet = swallowedPet.belugaSwallowedPet ?? null;
            }

            owner.removeAbility('AbominationAbility')
            owner.gainAbilities(copyPet, 'Pet', swallowedPet.level ?? 1);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AbominationAbility {
        return new AbominationAbility(newOwner, this.logService, this.petService);
    }
}
