import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Dog extends Pet {
    name = "Dog";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 3;
    friendSummoned = () => {
        let boostAtkAmt = this.level * 2;
        let boostHealthAmt = this.level;
        this.increaseAttack(boostAtkAmt);
        this.increaseHealth(boostHealthAmt);
        this.logService.createLog({
            message: `Dog gained ${boostAtkAmt} attack and ${boostHealthAmt} health.`,
            type: 'ability',
            player: this.parent
        })
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