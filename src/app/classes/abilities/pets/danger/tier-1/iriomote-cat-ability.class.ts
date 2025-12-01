import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";
import { getRandomInt } from "app/util/helper-functions";

export class IriomoteCatAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'IriomoteCatAbility',
            owner: owner,
            triggers: ['BeforeStartBattle'],
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

        let allTierXPets = this.petService.allPets.get(this.level);
        let randomIndex = getRandomInt(0, allTierXPets.length - 1);
        let randomPetName = allTierXPets[randomIndex];

        let transformedPet = this.petService.createPet({
            name: randomPetName,
            attack: owner.attack,
            health: owner.health,
            exp: 0,
            equipment: owner.equipment,
            mana: owner.mana
        }, owner.parent);

        this.logService.createLog({
            message: `${owner.name} transformed into a ${randomPetName} (Level ${transformedPet.level}).`,
            type: 'ability',
            player: owner.parent,
            randomEvent: true
        });

        owner.parent.transformPet(owner, transformedPet);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): IriomoteCatAbility {
        return new IriomoteCatAbility(newOwner, this.logService, this.petService);
    }
}