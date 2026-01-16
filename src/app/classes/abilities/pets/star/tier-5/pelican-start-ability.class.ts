import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class PelicanStartAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'PelicanStartAbility',
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

        let excludePets = owner.parent.getPetsWithoutEquipment('Strawberry');
        let targetsAheadResp = owner.parent.nearestPetsAhead(this.level, owner, excludePets);
        let targets = targetsAheadResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let currentPet of targets) {
            // Create Salmon copy to swallow (transform the swallowed pet into Salmon)
            let salmon = this.petService.createPet({
                name: 'Salmon',
                attack: currentPet.attack,
                health: currentPet.health,
                exp: currentPet.exp,
                equipment: null,
                mana: 0
            }, owner.parent);

            owner.swallowedPets.push(salmon);
            currentPet.health = 0;

            this.logService.createLog({
                message: `${owner.name} swallowed ${currentPet.name}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsAheadResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PelicanStartAbility {
        return new PelicanStartAbility(newOwner, this.logService, this.petService);
    }
}
