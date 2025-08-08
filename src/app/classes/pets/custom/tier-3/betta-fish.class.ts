import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class BettaFish extends Pet {
    name = "Betta Fish";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 3;
    faint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let target = this.petBehind();
        if (target == null) {
            return;
        }
        let power: Power = {
            health: this.level * 2,
            attack: this.level * 4
        }
        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
        })
        
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