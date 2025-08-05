import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Monty } from "../../pets/hidden/monty.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class EasterEgg extends Equipment {
    name = 'Easter Egg';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }

        for (let i = 0; i < multiplier; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let monty = new Monty(this.logService, this.abilityService, pet.parent, null, null, 0, 0);
                    pet.parent.summonPet(monty, pet.savedPosition);
        
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
                    this.abilityService.triggerSummonedEvents(monty);
                },
                priority: -1
            })
        }
    }
    

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}