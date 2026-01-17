import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

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
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let swallowedPets: Array<{ name: string; level: number }> = [];
        let oneSwallowed = false;
        let twoSwallowed = false;
        let threeSwallowed = false;
        const swallowSpots = this.level;

        for (let i = 0; i < swallowSpots; i++) {
            if (owner.abominationSwallowedPet1 != null && !oneSwallowed) {
                swallowedPets.push({
                    name: owner.abominationSwallowedPet1,
                    level: owner.abominationSwallowedPet1Level ?? 1
                });
                oneSwallowed = true;
            } else if (owner.abominationSwallowedPet2 != null && !twoSwallowed) {
                swallowedPets.push({
                    name: owner.abominationSwallowedPet2,
                    level: owner.abominationSwallowedPet2Level ?? 1
                });
                twoSwallowed = true;
            } else if (owner.abominationSwallowedPet3 != null && !threeSwallowed) {
                swallowedPets.push({
                    name: owner.abominationSwallowedPet3,
                    level: owner.abominationSwallowedPet3Level ?? 1
                });
                threeSwallowed = true;
            }
        }
        for (let swallowedPet of swallowedPets) {
            let copyPet = this.petService.createPet({
                attack: null,
                health: null,
                mana: null,
                equipment: null,
                name: swallowedPet.name,
                exp: 0
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
