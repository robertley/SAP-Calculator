import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Spinosaurus extends Pet {
    name = "Spinosaurus";
    tier = 6;
    pack: Pack = 'Star';
    attack = 4;
    health = 8;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power: Power = {
            attack: this.level * 3,
            health: this.level * 2
        }
        let target = this.parent.getRandomPet([this], true, false, true);
        if (target == null) {
            return;
        }
        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        })
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