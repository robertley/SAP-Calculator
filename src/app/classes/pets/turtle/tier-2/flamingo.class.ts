import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Flamingo extends Pet {
    name = "Flamingo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 3;

    faint(gameApi, tiger, pteranodon?: boolean) {
        let power: Power = {
            attack: this.level,
            health: this.level
        }
        let targetsResp = this.parent.nearestPetsBehind(2, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            target.increaseAttack(this.level);
            target.increaseHealth(this.level);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${this.level} attack and ${this.level} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
        }

        super.superFaint(gameApi, tiger);
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