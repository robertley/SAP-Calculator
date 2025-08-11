import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Tandgnost } from "../../pets/custom/tier-5/tandgnost.class";
import { Tandgrisner } from "../../pets/custom/tier-5/tandgrisner.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class YggdrasilFruit extends Equipment {
    name = 'Yggdrasil Fruit';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet?: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Yggdrasil Fruit') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }

            for (let i = 0; i < multiplier; i++) {
                let tandgnost = new Tandgnost(this.logService, this.abilityService, pet.parent, 3, 3, 0);
                let tandgrisner = new Tandgrisner(this.logService, this.abilityService, pet.parent, 3, 3, 0);
    
                let pantherMessage = '';
                if (i > 0) {
                    pantherMessage = ` (Panther)`;
                }
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Tandgnost (Yggdrasil Fruit)${pantherMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(tandgnost, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(tandgnost);
                }
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Tandgrisner (Yggdrasil Fruit)${pantherMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(tandgrisner, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(tandgrisner);
                }
            }
        }
    }
    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}