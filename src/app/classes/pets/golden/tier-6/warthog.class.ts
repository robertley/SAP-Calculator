import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
            let target = this.parent.getRandomPet(null, true, null, true);
            if (target == null) {
                break;
            }
            target.increaseAttack(power);
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: true
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