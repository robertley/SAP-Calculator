import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";

export class WhaleSwallowAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'WhaleSwallowAbility',
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

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let targetPet = targetsAheadResp.pets[0];
        let swallowPet = this.petService.createPet({
            name: targetPet.name,
            attack: targetPet.attack,
            health: targetPet.health,
            exp: owner.exp,
            equipment: null,
            mana: 0
        }, owner.parent);
        (owner as any).swallowedPets.push(swallowPet);
        targetPet.health = 0;
        this.logService.createLog({
            message: `${owner.name} swallowed ${targetPet.name}`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WhaleSwallowAbility {
        return new WhaleSwallowAbility(newOwner, this.logService, this.petService);
    }
}