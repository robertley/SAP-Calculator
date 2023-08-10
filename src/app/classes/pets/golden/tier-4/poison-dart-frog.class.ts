import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PoisonDartFrog extends Pet {
    name = "Poison Dart Frog";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 5;
    health = 2;
    friendAheadFaints(gameApi: GameAPI, tiger?: boolean): void {
        let highestHealthResp = this.parent.opponent.getHighestHealthPet();
        let target = highestHealthResp.pet;
        this.snipePet(target, 3 * this.level, highestHealthResp.random, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}