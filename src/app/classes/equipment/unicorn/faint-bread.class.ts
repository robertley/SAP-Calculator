import { AbilityService } from "../../../services/ability.service";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";


export class FaintBread extends Equipment {
    name = 'Faint Bread';
    equipmentClass: EquipmentClass = 'afterFaint';
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Faint Bread') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }

            for (let i = 0; i < multiplier; i++) {
                let faintPet = this.petService.getRandomFaintPet(pet.parent, 1);
    
                let pantherMessage = '';
                if (i > 0) {
                    pantherMessage = ` (Panther)`;
                }
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${faintPet.name} (Faint Bread)${pantherMessage}`,
                        type: "ability",
                        player: pet.parent,
                        randomEvent: true
                    }
                )
                if (pet.parent.summonPet(faintPet, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(faintPet);
                }
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService

    ) {
        super()
    }

}