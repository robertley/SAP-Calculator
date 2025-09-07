import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Peacock extends Pet {
    name = "Peacock";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 5;
    attack = 2;
    hurt(gameApi, pet, tiger) {
        if (this.health < 1) {
            return;
        }
        let boost = this.level * 3;
        let selfTargetResp = this.parent.getThis(this);
        if (selfTargetResp.pet) {
            selfTargetResp.pet.increaseAttack(boost);
            this.logService.createLog({
                message: `${this.name} gave ${selfTargetResp.pet.name} ${boost} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        super.superHurt(gameApi, pet, tiger);
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