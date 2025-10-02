import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class GoldenTamarinAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'GoldenTamarinAbility',
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

        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;

        if (!target) {
            return;
        }

        // Golden Tamarin pool of tier 5+ Start of Battle pets
        const petNames = ["Crocodile", "Red Dragon",  "Salmon of Knowledge", "Sea Cucumber", "Werewolf", "Tarantula Hawk", "Snow Leopard"];
        let randomIndex = Math.floor(Math.random() * petNames.length);
        let selectedPetName = petNames[randomIndex];

        let newPet = this.petService.createPet({
            name: selectedPetName,
            health: target.health,
            attack: target.attack,
            mana: target.mana,
            exp: target.exp,
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

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GoldenTamarinAbility {
        return new GoldenTamarinAbility(newOwner, this.logService, this.petService);
    }
}