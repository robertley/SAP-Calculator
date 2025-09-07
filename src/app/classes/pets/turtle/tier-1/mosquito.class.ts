import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { LogService } from "../../../../services/log.service";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Equipment } from "../../../equipment.class";
import { AbilityService } from "../../../../services/ability.service";

export class Mosquito extends Pet {
    name = "Mosquito";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    startOfBattle(gameApi: GameAPI, tiger: boolean) {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        let targetsResp = opponent.getRandomPets(this.level, null, null, true, this);
        for (let target of targetsResp.pets) {
            if (target != null) {
                this.snipePet(target, 1, targetsResp.random, tiger);
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