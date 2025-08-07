import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mosasaurus extends Pet {
    name = "Mosasaurus";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 5;
    health = 6;
    friendlyToyBroke(gameApi: GameAPI, tiger?: boolean): void {
        let targets = [];
        if (this.petAhead) {
            targets.push(this.petAhead);
        }
        if (this.petBehind()) {
            targets.push(this.petBehind());
        }
        if (targets.length == 0) {
            return;
        }
        let power: Power = {
            attack: 2,
            health: 3
        };
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power.attack} attach and ${power.health} health.`,
                type: 'ability',
                player: this.parent,
                randomEvent: false,
                tiger: tiger
            });
            target.increaseHealth(power.health);
            target.increaseAttack(power.attack);
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