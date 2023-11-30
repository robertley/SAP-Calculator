import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SabertoothTiger extends Pet {
    name = "Sabertooth Tiger";
    tier = 6;
    pack: Pack = 'Star';
    attack = 6;
    health = 6;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 5;
        let petPool: string[];
        if (this.parent == gameApi.player) {
            petPool = gameApi.playerPetPool.get(1);
        } else {
            petPool = gameApi.opponentPetPool.get(1);
        }
        let petName = petPool[Math.floor(Math.random() * petPool.length)];
        this.abilityService.setSpawnEvent({
            callback: () => {
                let pet = this.petService.createPet({
                    name: petName,
                    attack: power,
                    health: power,
                    equipment: null,
                    exp: 0
                }, this.parent)
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${pet.name} (${power}/${power}).`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: true
                    }
                )

                if (this.parent.summonPet(pet, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(pet);
                }
            },
            priority: this.attack
        })

        super.superHurt(gameApi, tiger);
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