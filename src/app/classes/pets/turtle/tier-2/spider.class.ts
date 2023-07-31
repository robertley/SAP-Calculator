import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
    faint(gameApi: GameAPI, tiger) {
        let possibleSpawnPets = this.petService.tier3Pets.filter(pet => {
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
            name: spawnPetName
        }, this.parent);
        this.abilityService.setSpawnEvent({
            callback: () => {
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${spawnPet.name} level ${level} (${power}/${power})`,
                        type: "ability",
                        player: this.parent,
                        randomEvent: true,
                        tiger: tiger
                    }
                )

                if (this.parent.summonPet(spawnPet, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(spawnPet);
                }
            },
            priority: this.attack
        })
        super.superFaint(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}