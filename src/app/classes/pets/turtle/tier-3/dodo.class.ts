import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Dodo extends Pet {
    name = "Dodo";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 4;
    startOfBattle = (gameApi) =>{
        let boostPet = this.petAhead;
        let boostAmt = Math.floor(this.attack * (this.level * .5));
        boostPet.increaseAttack(boostAmt);
        this.logService.createLog({
            message: `Dodo gave ${boostPet.name} ${boostAmt} attack.`,
            player: this.parent,
            type: 'ability'
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