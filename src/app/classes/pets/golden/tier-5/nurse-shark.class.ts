import { clone, cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-4/orangutang.class";

export class NurseShark extends Pet {
    name = "Nurse Shark";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 4;
    health = 6;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.trumpets == 0) {
            return;
        }
        let power = Math.min(this.parent.trumpets, 6) * 3;
        let hasTarget = false;
        let targets = shuffle(clone(this.parent.opponent.petArray));
        for (let i = 0; i < this.level; i++) {
            let target = targets[i];
            if (target == null) {
                break;
            }
            hasTarget = true;
            this.snipePet(target, power, true, tiger, pteranodon);
        }

        if (hasTarget) {
            this.parent.spendTrumpets(Math.min(this.parent.trumpets, 6), this, pteranodon);
        }
        this.superFaint(gameApi, tiger);
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