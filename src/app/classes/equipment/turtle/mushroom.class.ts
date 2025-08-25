import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { AbilityService } from "../../../services/ability.service";
import { PetService } from "../../../services/pet.service";
// TODO mushroom bug spawning as level 1 even when level 3?
export class Mushroom extends Equipment {
    name = 'Mushroom';
    tier = 6;
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment !== this) {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let newPet = this.petService.createDefaultVersionOfPet(pet, 1, 1);
                
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';

                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${newPet.name} (level ${newPet.level}) (Mushroom)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(newPet, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(newPet);
                }
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super()
    }
}

