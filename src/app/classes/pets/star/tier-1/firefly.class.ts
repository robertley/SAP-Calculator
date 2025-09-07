import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Firefly extends Pet {
    name = "Firefly";
    tier = 1;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetsResp = this.parent.getPetsWithinXSpaces(this, this.level);
        let targets = targetsResp.pets

        if (targets.length == 0) {
            return;
        }
        for (const target of targets) {
            this.snipePet(target, 1, targetsResp.random, tiger, pteranodon);
        }

        this.superFaint(gameApi, tiger);
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