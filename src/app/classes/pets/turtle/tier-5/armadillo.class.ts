import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Armadillo extends Pet {
    name = "Armadillo";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 10;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetsResp = this.parent.getAll(true, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            let power = 8 * this.level;
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} increased health of ${pet.name} by ${power}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            })
        }

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