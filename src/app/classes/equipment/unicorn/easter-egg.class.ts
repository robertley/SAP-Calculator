import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Monty } from "../../pets/hidden/monty.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

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
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }

            for (let i = 0; i < multiplier; i++) {
                let monty = new Monty(this.logService, this.abilityService, pet.parent, null, null, 0, 0);
    
                let pantherMessage = '';
                if (i > 0) {
                    pantherMessage = ` (Panther)`;
                }
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Monty (Easter Egg)${pantherMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(monty, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(monty);
                }
            }
        }
    }
    

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}