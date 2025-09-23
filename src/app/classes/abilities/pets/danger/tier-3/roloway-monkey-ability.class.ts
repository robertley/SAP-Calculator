import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class RolowayMonkeyAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'RolowayMonkeyAbility',
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

        let targetResp = owner.parent.nearestPetsAhead(2, owner);
        if (targetResp.pets.length === 0) {
            return;
        }

        // Pool of useful hurt pets to transform into
        const petNames = ["Camel", "Peacock", "Porcupine", "Lizard", "Guineafowl"];

        for (let target of targetResp.pets) {
            let randomIndex = Math.floor(Math.random() * petNames.length);
            let selectedPetName = petNames[randomIndex];

            let newPet = this.petService.createPet({
                name: selectedPetName,
                health: target.health,
                attack: target.attack,
                mana: target.mana,
                exp: owner.exp,
                equipment: target.equipment
            }, owner.parent);

            owner.parent.transformPet(target, newPet);

            this.logService.createLog({
                message: `${owner.name} transformed ${target.name} into a ${newPet.attack}/${newPet.health} ${newPet.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: true
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RolowayMonkeyAbility {
        return new RolowayMonkeyAbility(newOwner, this.logService, this.petService);
    }
}