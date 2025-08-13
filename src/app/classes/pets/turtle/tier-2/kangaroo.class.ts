import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kangaroo extends Pet {
    name = "Kangaroo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    friendAheadAttacks(gameApi, pet, tiger) {
        if (!this.alive) {
            return;
        }
        this.increaseAttack(this.level)
        this.increaseHealth(this.level)
        this.logService.createLog({
    message: `${this.name} gained ${this.level} attack and ${this.level} health.`,
            type: 'ability',
            player: this.parent,
            tiger
        })
        super.superFriendAheadAttacks(gameApi, pet, tiger)
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