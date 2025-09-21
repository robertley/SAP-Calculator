import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";
import { getRandomInt } from "../../../../../util/helper-functions";

export class SpiderAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'SpiderAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let tier3Pets;
        if (owner.parent == gameApi.player) {
            tier3Pets = gameApi.playerPetPool.get(3);
        } else {
            tier3Pets = gameApi.opponentPetPool.get(3);
        }

        let possibleSpawnPets = tier3Pets.filter(pet => {
            return pet != 'Spider'
        });

        let spawnPetName = possibleSpawnPets[getRandomInt(0, possibleSpawnPets.length - 1)];
        let level = this.level;
        let exp = this.minExpForLevel;
        let power = this.level * 2;

        let spawnPet = this.petService.createPet({
            attack: power,
            exp: exp,
            equipment: null,
            health: power,
            name: spawnPetName,
            mana: 0
        }, owner.parent);

        let summonResult = owner.parent.summonPet(spawnPet, owner.savedPosition, false, owner);

        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned ${spawnPet.name} level ${level} (${power}/${power})`,
                type: "ability",
                player: owner.parent,
                randomEvent: true, 
                tiger: tiger,
                pteranodon: pteranodon
            });

            this.abilityService.triggerFriendSummonedEvents(spawnPet);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SpiderAbility {
        return new SpiderAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}