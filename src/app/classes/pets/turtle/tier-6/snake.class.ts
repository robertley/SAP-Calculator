import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
    friendAheadAttacks(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 5;
        let target = getOpponent(gameApi, this.parent).getRandomPet(null, null, true);
        if (!target) {
            return;
        }
        this.snipePet(target, power, true, tiger);
        this.superFriendAheadAttacks(gameApi, tiger);
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