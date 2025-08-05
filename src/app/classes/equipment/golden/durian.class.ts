import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Durian extends Equipment {
    name = 'Durian';
    equipmentClass: EquipmentClass = 'snipe';
    uses = 1;
    originalUses = 1;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let resp = attackedPet.parent.getHighestHealthPet();
        let targetPet = resp.pet;
        if (targetPet == null) {
            console.warn("durian didn't find target") // p sure this should never happen?
            return;
        }

        let power = .33;
        let reducedTo =  Math.max(1, Math.floor(targetPet.health * (1 - power)));
        targetPet.health = reducedTo;
        this.logService.createLog({
            message: `${this.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})`,
            type: 'ability',
            player: pet.parent,
            randomEvent: resp.random
        });

    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}