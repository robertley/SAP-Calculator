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
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.trumpets < 1) {
            return;
        }
        let targets = this.parent.opponent.getRandomPets(this.level, null, null, true);
        for (let target of targets) {
            this.snipePet(target, 3, true, tiger, pteranodon);
        }
        if (targets.length > 0) {
            this.parent.spendTrumpets(1, this, pteranodon);
        }
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