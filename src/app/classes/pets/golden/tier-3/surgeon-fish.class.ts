import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class SurgeonFish extends Pet {
    name = "Surgeon Fish";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 3;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.petBehind();
        if (target == null) {
            return;
        }
        if (this.parent.trumpets < 2) {
            return;
        }
        this.parent.spendTrumpets(2, this);
        let power = this.level * 6;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superBeforeAttack(gameApi, tiger);
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