import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";
import { Monkey } from "../../pets/turtle/tier-5/monkey.class";

export class Banana extends Equipment {
    name = 'Banana';
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
                let monke = new Monkey(this.logService, this.abilityService, pet.parent, 4, 4, 0, 0);
    
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Monkey (Banana)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(monke, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(monke);
                }
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super()
    }
}