import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO fix bug when spawned out of spider getting bonus
export class Dog extends Pet {
    name = "Dog";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 2;
    friendSummoned(gameApi, pet, tiger) {
        if (pet == this) {
            return;
        }
        let boostAtkAmt = this.level * 2;
        let boostHealthAmt = this.level;
        this.increaseAttack(boostAtkAmt);
        this.increaseHealth(boostHealthAmt);
        this.logService.createLog({
            message: `${this.name} gained ${boostAtkAmt} attack and ${boostHealthAmt} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        super.superFriendSummoned(gameApi, pet, tiger);
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