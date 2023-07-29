import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kangaroo extends Pet {
    name = "Kangaroo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 2;
    friendAheadAttacks(gameApi, tiger) {
        this.increaseAttack(this.level)
        this.increaseHealth(this.level)
        this.logService.createLog({
    message: `${this.name} gained ${this.level} attack and ${this.level} health.`,
            type: 'ability',
            player: this.parent,
            tiger
        })
        super.superFriendAheadAttacks(gameApi, tiger)
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}