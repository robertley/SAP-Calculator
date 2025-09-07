import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HarpyEagle extends Pet {
    name = "Harpy Eagle";
    tier = 6;
    pack: Pack = 'Custom';
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
        let summonPet = this.petService.createPet({
            name: petName,
            attack: power,
            health: power,
            equipment: null,
            mana: 0,
            exp: 0
        }, this.parent)

        let summonResult = this.parent.summonPet(summonPet, this.savedPosition, false, this);
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned ${summonPet.name} (${power}/${power}).`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: true
                }
            )

            this.abilityService.triggerFriendSummonedEvents(summonPet);
        }

        super.superHurt(gameApi, pet, tiger);
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