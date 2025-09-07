import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PiedTamarin extends Pet {
    name = "Pied Tamarin";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.trumpets < 1) {
            return;
        }
        let targetsResp = this.parent.opponent.getRandomPets(this.level, null, null, true, this);
        for (let target of targetsResp.pets) {
            if (target != null) {
                this.snipePet(target, 3, targetsResp.random, tiger, pteranodon);
            }
        }
        if (targetsResp.pets.length > 0) {
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