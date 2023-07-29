import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Horse extends Pet {
    name = "Horse";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 1;
    attack = 2;
    friendSummoned(pet, tiger) {
        pet.increaseAttack(this.level);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${this.level} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        super.superFriendSummoned(pet, tiger);
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