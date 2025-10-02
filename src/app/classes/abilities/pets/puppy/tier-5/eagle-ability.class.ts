import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class EagleAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'EagleAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let tier = Math.min(6, gameApi.previousShopTier + 1);
        let pets;
        if (owner.parent == gameApi.player) {
            pets = gameApi.playerPetPool.get(tier);
        } else {
            pets = gameApi.opponentPetPool.get(tier);
        }
        let petName = pets[Math.floor(Math.random() * pets.length)];
        let power = this.level * 5;
        let pet = this.petService.createPet({
            name: petName,
            attack: power,
            health: power,
            exp: owner.minExpForLevel,
            equipment: null,
            mana: 0
        }, owner.parent);

        let summonResult = owner.parent.summonPet(pet, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned ${pet.name} Level ${pet.level}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: true,
                pteranodon: pteranodon
            });

            this.abilityService.triggerFriendSummonedEvents(pet);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): EagleAbility {
        return new EagleAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}