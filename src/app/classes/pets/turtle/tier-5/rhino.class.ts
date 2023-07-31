import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Rhino extends Pet {
    name = "Rhino";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 6;
    knockOut(gameApi: GameAPI, tiger?: boolean): void {
        let target = getOpponent(gameApi, this).furthestUpPet;
        if (target == null) {
            return;
        }
        let power = this.level * 4;
        if (target.tier == 1) {
            power *= 2;
        }
        this.snipePet(target, power, false, tiger);

        this.superKnockOut(gameApi, tiger);
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