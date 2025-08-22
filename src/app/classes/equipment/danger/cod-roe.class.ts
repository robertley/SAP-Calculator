import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Fish } from "../../pets/turtle/tier-1/fish.class";

export class CodRoe extends Equipment {
    name = 'Cod Roe';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Cod Roe') {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let fish = new Fish(this.logService, this.abilityService, pet.parent, 3, 2, 0, 0);
    
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog({
                    message: `${pet.name} spawned ${fish.name} (Cod Roe)${multiplierMessage}`,
                    type: 'equipment',
                    player: pet.parent
                });
                
                if (pet.parent.summonPet(fish, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(fish);
                }
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