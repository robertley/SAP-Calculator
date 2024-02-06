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
    friendAheadFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let highestHealthResp = this.parent.opponent.getHighestHealthPet();
        let target = highestHealthResp.pet;
        if (target == null) {
            return;
        }
        this.snipePet(target, 4 * this.level, highestHealthResp.random, tiger);
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