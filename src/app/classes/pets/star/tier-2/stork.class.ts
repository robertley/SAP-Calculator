import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Stork extends Pet {
    name = "Stork";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let summonPetPool;
        let tier = Math.max(1, gameApi.previousShopTier - 1);
        if (this.parent == gameApi.player){
            summonPetPool = gameApi.playerPetPool.get(tier);
        } else {
            summonPetPool = gameApi.opponentPetPool.get(tier);
        }
        
        let summonPetName = summonPetPool[Math.floor(Math.random() * summonPetPool.length)];
        this.abilityService.setSpawnEvent({
            callback: () => {
                let oldStork = gameApi.oldStork;
                let summonPet = this.petService.createPet({
                    name: summonPetName,
                    attack: oldStork ? null : 3 * this.level,
                    equipment: null,
                    exp: this.minExpForLevel,
                    health: oldStork ? null : 2 * this.level,
                }, this.parent);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${summonPet.name} Level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: true,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(summonPet, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(summonPet);
                }
            },
            priority: this.attack
        })
        this.superFaint(gameApi, tiger);
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