import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AtlanticPuffin extends Pet {
    name = "Atlantic Puffin";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 2;
    health = 3;
    friendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.equipment?.name != 'Strawberry') {
            return
        }
        this.logService.createLog({
            message: `${this.name} removed ${pet.name}'s ${pet.equipment.name}.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
        })
        pet.removePerk()
        let power = 2 * this.level;
        let targetResp = this.parent.opponent.getLastPet()
        let target = targetResp.pet
        if (target == null) {
            return;
        } 
        this.snipePet(target, power, targetResp.random, tiger)

        this.superStartOfBattle(gameApi, tiger);
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