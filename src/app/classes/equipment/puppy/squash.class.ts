import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Squash extends Equipment {
    name = 'Squash';
    tier = 3;
    equipmentClass: EquipmentClass = 'snipe';
    uses = 1;
    originalUses = 1;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let targetPet = attackedPet;
        if (targetPet == null) {
            console.warn("squash didn't find target") // p sure this should never happen?
            return;
        }

        let power = 6;
        let reducedTo =  Math.max(1, targetPet.health - power);
        targetPet.health = reducedTo;
        this.logService.createLog({
            message: `${this.name} reduced ${targetPet.name} health by ${power} (${reducedTo})`,
            type: 'equipment',
            player: pet.parent,
        });

    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}