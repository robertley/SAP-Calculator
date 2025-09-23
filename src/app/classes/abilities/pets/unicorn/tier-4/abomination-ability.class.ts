import { Ability } from "../../../../ability.class";
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
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let swallowedPets = [];
        let oneSwallowed = false;
        let twoSwallowed = false;
        let threeSwallowed = false;
        const swallowSpots = this.level;

        for (let i = 0; i < swallowSpots; i++) {
            if (owner.abominationSwallowedPet1 != null && !oneSwallowed) {
                swallowedPets.push(owner.abominationSwallowedPet1);
                oneSwallowed = true;
            } else if (owner.abominationSwallowedPet2 != null && !twoSwallowed) {
                swallowedPets.push(owner.abominationSwallowedPet2);
                twoSwallowed = true;
            } else if (owner.abominationSwallowedPet3 != null && !threeSwallowed) {
                swallowedPets.push(owner.abominationSwallowedPet3);
                threeSwallowed = true;
            }
        }
        for (let swallowedPet of swallowedPets) {
            let copyPet = this.petService.createPet({
                attack: null,
                health: null,
                mana: null,
                equipment: null,
                name: swallowedPet,
                exp: 0
            }, owner.parent);

            if (!copyPet) {
                return;
            }
            this.logService.createLog({
                message: `${owner.name} gained ${swallowedPet}'s Ability.`,
                type: 'ability',
                player: owner.parent
            });
            owner.removeAbility('AbominationAbility')
            owner.gainAbilities(copyPet, 'Pet', 1);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AbominationAbility {
        return new AbominationAbility(newOwner, this.logService, this.petService);
    }
}