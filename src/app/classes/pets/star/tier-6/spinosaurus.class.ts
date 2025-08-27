import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Spinosaurus extends Pet {
    name = "Spinosaurus";
    tier = 6;
    pack: Pack = 'Star';
    attack = 4;
    health = 4;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        } 
        let power: Power = {
            attack: this.level * 2,
            health: this.level * 3
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
        
        super.superFriendFaints(gameApi, pet, tiger);
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