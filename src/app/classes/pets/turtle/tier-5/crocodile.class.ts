import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Crocodile extends Pet {
    name = "Crocodile";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 8;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            let targetPet = getOpponent(gameApi, this.parent).getLastPet();
            if (targetPet) {
                this.snipePet(targetPet, 8, false, tiger);
            }
        }
        super.superStartOfBattle(gameApi, tiger);
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