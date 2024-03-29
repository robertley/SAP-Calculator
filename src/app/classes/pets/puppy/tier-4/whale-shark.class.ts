import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class WhaleShark extends Pet {
    name = "Whale Shark";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 4;
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

    givePetEquipment(equipment: Equipment): void {
        super.givePetEquipment(equipment);
        this.equipment = null;
        let power = this.level * 2;
        this.increaseAttack(power);
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} removed ${equipment.name} and gained ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent
        });
    }
}