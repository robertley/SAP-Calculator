import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Dolphin extends Pet {
    name = "Dolphin";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 4;
    startOfBattle(gameApi, tiger) {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        for (let i = 0; i < this.level; i++) {
            let lowestHealthResp = opponent.getLowestHealthPet();
            if (!lowestHealthResp.pet) {
                break;
            }
            this.snipePet(lowestHealthResp.pet, 4, lowestHealthResp.random, tiger);
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