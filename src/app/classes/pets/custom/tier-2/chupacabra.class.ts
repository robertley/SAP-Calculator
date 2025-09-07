import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Chupacabra extends Pet {
    name = "Chupacabra";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 4;
    health = 2;
    knockOut(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        for (let i = 0; i < this.level * 3; i++) {
            let targetResp = this.parent.getRandomPet([this], true, false, true, this);
            if (targetResp.pet == null) {
                return;
            }
            this.logService.createLog({
                message: `${this.name} gave ${targetResp.pet.name} 1 health.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            })
            targetResp.pet.increaseHealth(1);
        }
        this.superKnockOut(gameApi, pet, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
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