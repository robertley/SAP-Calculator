import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class GoblinSharkStartAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'GoblinSharkStartAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let swallowThreshold = this.level * 6;

        // Loop through enemy pets from front to back to find first swallowable target
        for (let targetPet of owner.parent.opponent.petArray) {
            if (!targetPet.alive) {
                continue;
            }

            if (targetPet.health <= swallowThreshold) {
                // Create a copy of the target pet to swallow
                let swallowPet = this.petService.createPet({
                    name: targetPet.name,
                    attack: targetPet.attack,
                    health: targetPet.health,
                    exp: targetPet.exp,
                    equipment: null,
                    mana: 0
                }, owner.parent);

                owner.swallowedPets.push(swallowPet);
                targetPet.health = 0;

                this.logService.createLog({
                    message: `${owner.name} swallowed ${targetPet.name}`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                });
                break; // Stop after swallowing one pet
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GoblinSharkStartAbility {
        return new GoblinSharkStartAbility(newOwner, this.logService, this.petService);
    }
}