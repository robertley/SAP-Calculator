import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";
import { Monkey } from "../../pets/turtle/tier-5/monkey.class";

export class Banana extends Equipment {
    name = 'Banana';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }

        for (let i = 0; i < multiplier; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let monke = new Monkey(this.logService, this.abilityService, pet.parent, 4, 4, 0);
                    pet.parent.summonPet(monke, pet.savedPosition);
        
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
                    this.abilityService.triggerSummonedEvents(monke);
                },
                priority: pet.attack
            })
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super()
    }
}