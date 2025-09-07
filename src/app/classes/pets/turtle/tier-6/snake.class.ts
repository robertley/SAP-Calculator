import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { getOpponent } from "app/util/helper-functions";

export class Snake extends Pet {
    name = "Snake";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 6;
    friendAheadAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 5;
        let targetResp = getOpponent(gameApi, this.parent).getRandomPet([], false, true, false, this);
        if (!targetResp.pet) {
            return;
        }
        this.snipePet(targetResp.pet, power, targetResp.random, tiger);
        this.superFriendAheadAttacks(gameApi, pet, tiger);
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