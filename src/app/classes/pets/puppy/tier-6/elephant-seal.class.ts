import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class ElephantSeal extends Pet {
    name = "Elephant Seal";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 9;
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
        let power = this.level;
        for (let pet of this.parent.petArray) {
            if (pet == this) {
                continue;
            }
            if (!pet.alive) {
                continue;
            }
            pet.increaseAttack(power);
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent
            })
        }
    }
}