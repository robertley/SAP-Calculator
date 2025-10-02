import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";
import { AbilityService } from "app/services/ability.service";

export class HarpyEagleAbility extends Ability {
    private logService: LogService;
    private petService: PetService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, petService: PetService, abilityService: AbilityService) {
        super({
            name: 'HarpyEagleAbility',
            owner: owner,
            triggers: ['ThisHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.petService = petService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power = this.level * 5;
        let petPool: string[];
        if (owner.parent === gameApi.player) {
            petPool = gameApi.playerPetPool.get(1);
        } else {
            petPool = gameApi.opponentPetPool.get(1);
        }

        let petName = petPool[Math.floor(Math.random() * petPool.length)];
        let summonPet = this.petService.createPet({
            name: petName,
            attack: power,
            health: power,
            equipment: null,
            mana: 0,
            exp: 0
        }, owner.parent);

        let summonResult = owner.parent.summonPet(summonPet, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned ${summonPet.name} (${power}/${power}).`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: true
            });

            this.abilityService.triggerFriendSummonedEvents(summonPet);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HarpyEagleAbility {
        return new HarpyEagleAbility(newOwner, this.logService, this.petService, this.abilityService);
    }
}