import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Chihuahua extends Pet {
    name = "Chihuahua";
    tier = 1;
    pack: Pack = 'Star';
    attack = 4;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let targetResult = opponent.getHighestHealthPet();
        let target = targetResult.pet;
        let randomEvent = targetResult.random;
        this.parent.pushPet(target, this.level);
        let s = this.level > 1 ? 's' : '';
        this.logService.createLog(
            {
                message: `${this.name} pushes ${target.name} forward ${this.level} space${s}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: randomEvent
            }
        );
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