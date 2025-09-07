import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Horse extends Pet {
    name = "Horse";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 1;
    attack = 2;
    friendSummoned(gameApi, pet, tiger) {
        let targetResp = this.parent.getSpecificPet(this, pet)
        if (targetResp.pet == null) {
            return
        }
        targetResp.pet.increaseAttack(this.level);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${this.level} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
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