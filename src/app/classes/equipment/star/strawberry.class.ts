import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Strawberry extends Equipment {
    name = 'Strawberry';
    equipmentClass: EquipmentClass = 'faint';

    // This callback is executed when the pet holding the Strawberry faints.
    callback = (pet: Pet) => {
        const target = pet.parent.getLastPet();

        if (target) {
            const buffAmount = 1;

            this.logService.createLog({
                message: `${pet.name} (Strawberry) gave ${target.name} +${buffAmount} attack and +${buffAmount} health.`,
                type: 'ability',
                player: pet.parent
            });

            target.increaseAttack(buffAmount);
            target.increaseHealth(buffAmount);
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super();
    }
}