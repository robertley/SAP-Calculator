import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class WhaleShark extends Pet {
    name = "Whale Shark";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 6;
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
    //overwrites gave pet equipment
    //TO DO: need more accurate way to implement the ability
    givePetEquipment(equipment: Equipment): void {
        super.givePetEquipment(equipment);
        this.removePerk();
        this.logService.createLog({
            message: `${this.name} removed ${equipment.name}`,
            type: 'ability',
            player: this.parent
        });

        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let power = this.level * 3;
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            randomEvent: targetResp.random
        });
    }
}