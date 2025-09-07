import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Strawberry extends Equipment {
    name = 'Strawberry';
    equipmentClass = 'defense' as EquipmentClass;
    tier = 1;
    uses = 2;
    originalUses = 2;

    callback = (pet: Pet) => {
        let originalFaint =pet.faint?.bind(pet);
                
        pet.faint = (gameApi, tiger, pteranodon) => {
            // Call original faint ability first
            if (originalFaint != null) {
                originalFaint(gameApi, tiger, pteranodon);
            }
            
            if (tiger) {
                return;
            }

            // Add Strawberry effect
            const targetResp = pet.parent.getLastPet();
            if (targetResp.pet) {
                const buffAmount = 1;

                this.logService.createLog({
                    message: `${pet.name} (Strawberry) gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health.`,
                    type: 'equipment',
                    player: pet.parent,
                    randomEvent: targetResp.random
                });

                targetResp.pet.increaseAttack(buffAmount);
                targetResp.pet.increaseHealth(buffAmount);
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super();
    }
}