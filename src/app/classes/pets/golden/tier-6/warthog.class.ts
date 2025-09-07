import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Warthog extends Pet {
    name = "Warthog";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 9;
    health = 6;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power = this.level;
        let triggers = Math.floor(this.attack / 3);
        for (let i = 0; i < triggers; i++) {
            let targetResp = this.parent.getRandomPet([], true, false, true, this);
            if (targetResp.pet == null) {
                break;
            }
            targetResp.pet.increaseAttack(power);
            targetResp.pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${targetResp.pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            })
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