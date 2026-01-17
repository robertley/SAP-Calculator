import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";

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
        const orderedSwallowedPets: Array<{ name?: string | null; level: number; timesHurt: number }> = [
            {
                name: owner.abominationSwallowedPet1,
                level: owner.abominationSwallowedPet1Level ?? 1,
                timesHurt: owner.abominationSwallowedPet1TimesHurt ?? 0
            },
            {
                name: owner.abominationSwallowedPet2,
                level: owner.abominationSwallowedPet2Level ?? 1,
                timesHurt: owner.abominationSwallowedPet2TimesHurt ?? 0
            },
            {
                name: owner.abominationSwallowedPet3,
                level: owner.abominationSwallowedPet3Level ?? 1,
                timesHurt: owner.abominationSwallowedPet3TimesHurt ?? 0
            }
        ].filter((pet): pet is { name: string; level: number; timesHurt: number } => pet.name != null);
        const swallowedPets = orderedSwallowedPets.slice(0, swallowSpots);
        // Tiger repeats only the first swallowed pet's ability.
        let executedSwallowedPets = swallowedPets;
        if (tiger && swallowedPets.length > 0) {
            executedSwallowedPets = swallowedPets.slice(0, 1);
        }
        for (let swallowedPet of executedSwallowedPets) {
            let copyPet = this.petService.createPet({
                attack: null,
                health: null,
                mana: null,
                equipment: null,
                name: swallowedPet.name,
                exp: 0,
                timesHurt: swallowedPet.timesHurt ?? 0
            }, owner.parent);

            if (!copyPet) {
                return;
            }
            this.logService.createLog({
                message: `${owner.name} gained ${swallowedPet.name}'s Ability.`,
                type: 'ability',
                player: owner.parent
            });
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
