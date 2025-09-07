import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { getRandomInt } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Spider extends Pet {
    name = "Spider";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    afterFaint(gameApi: GameAPI, tiger, pteranodon?: boolean) {
        let tier3Pets;
        if (this.parent == gameApi.player) {
            tier3Pets = gameApi.playerPetPool.get(3);
        } else {
            tier3Pets = gameApi.opponentPetPool.get(3);
        }
        let possibleSpawnPets = tier3Pets.filter(pet => {
            return pet != 'Spider'
        });
        let spawnPetName = possibleSpawnPets[getRandomInt(0, possibleSpawnPets.length - 1)];
        let level = this.level;
        let power = this.level * 2;
        let spawnPet = this.petService.createPet({
            attack: power,
            exp: this.minExpForLevel,
            equipment: null,
            health: power,
            name: spawnPetName,
            mana: 0
        }, this.parent);
        
        let summonResult = this.parent.summonPet(spawnPet, this.savedPosition, false, this);
        
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned ${spawnPet.name} level ${level} (${power}/${power})`,
                    type: "ability",
                    player: this.parent,
                    randomEvent: true, // Spider's normal ability is random (pet selection) + Silly can add more randomization
                    tiger: tiger,
                    pteranodon: pteranodon
                }
            )

            this.abilityService.triggerFriendSummonedEvents(spawnPet);
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}