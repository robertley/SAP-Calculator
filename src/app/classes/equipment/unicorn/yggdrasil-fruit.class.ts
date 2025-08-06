import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Tandgnost } from "../../pets/custom/tier-5/tandgnost.class";
import { Tandgrisner } from "../../pets/custom/tier-5/tandgrisner.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class YggdrasilFruit extends Equipment {
    name = 'Yggdrasil Fruit';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet?: Pet) => {
        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }

        for (let i = 0; i < multiplier; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let tan = new Tandgnost(this.logService, this.abilityService, pet.parent, 3, 3, 0);
                    pet.parent.summonPet(tan, pet.savedPosition);
        
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
                    this.abilityService.triggerSummonedEvents(tan);
                },
                priority: -1
            })
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let tan = new Tandgrisner(this.logService, this.abilityService, pet.parent, 3, 3, 0);
                    pet.parent.summonPet(tan, pet.savedPosition);
        
                    let pantherMessage = '';
                    if (i > 0) {
                        pantherMessage = ` (Panther)`;
                    }
                    this.logService.createLog(
                        {
                            message: `${pet.name} Spawned Tandgrisner (Yggdrasil Fruit)${pantherMessage}`,
                            type: "ability",
                            player: pet.parent
                        }
                    )
                    this.abilityService.triggerSummonedEvents(tan);
                },
                priority: -1
            })
        }
    }
    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}