import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let summonPetPool;
        let tier = Math.max(1, gameApi.previousShopTier - 1);
        if (this.parent == gameApi.player){
            summonPetPool = gameApi.playerPetPool.get(tier);
        } else {
            summonPetPool = gameApi.opponentPetPool.get(tier);
        }
        
        let summonPetName = summonPetPool[Math.floor(Math.random() * summonPetPool.length)];
        let oldStork = gameApi.oldStork;
        let summonPet = this.petService.createPet({
            name: summonPetName,
            attack: oldStork ? null : 3 * this.level,
            equipment: null,
            exp: this.minExpForLevel,
            health: oldStork ? null : 2 * this.level,
            mana: 0
        }, this.parent);

        let summonResult = this.parent.summonPet(summonPet, this.savedPosition, false, this);
        
        if (summonResult.success) {
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

            this.abilityService.triggerFriendSummonedEvents(summonPet);
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