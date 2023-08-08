import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PiedTamarin extends Pet {
    name = "Pied Tamarin";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        if (this.parent.trumpets < 1) {
            return;
        }
        let hasTarget = false;
        for (let i = 0; i < this.level; i++) {
            let target = this.parent.opponent.getRandomPet();
            if (target == null) {
                break;
            }
            hasTarget = true;
            this.snipePet(target, 3, true, tiger);
        }
        if (hasTarget) {
            this.parent.gainTrumpets(-1);
        }
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