import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Monty } from "../../pets/hidden/monty.class";

export class EasterEgg extends Equipment {
    name = 'Easter Egg';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Easter Egg') {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let monty = new Monty(this.logService, this.abilityService, pet.parent, null, null, 0, 0);
    
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Monty (Easter Egg)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(monty, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(monty);
                }
            }
        }
    }
    

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}