import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Seal extends Pet {
    name = "Seal";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 8;
    eatsFood(gameApi: GameAPI, pet, tiger?: boolean): void {
        if (pet != this) {
            return;
        }
        let power = this.level;
        let targetsResp = this.parent.getRandomPets(3, [this], true, false, this);
        for (let target of targetsResp.pets) {
            if (target != null) {
                target.increaseAttack(power);
                this.logService.createLog({
                    message: `${this.name} gave ${target.name} ${power} attack.`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: targetsResp.random
                });
            }
        }
        this.superGainedPerk(gameApi, pet, tiger);
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