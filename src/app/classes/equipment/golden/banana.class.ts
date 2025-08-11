import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";
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
            if (pet.equipment?.name != 'Banana') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }

            for (let i = 0; i < multiplier; i++) {
                let monke = new Monkey(this.logService, this.abilityService, pet.parent, 4, 4, 0, 0);
    
                let pantherMessage = '';
                if (i > 0) {
                    pantherMessage = ` (Panther)`;
                }
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Monkey (Banana)${pantherMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(monke, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(monke);
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