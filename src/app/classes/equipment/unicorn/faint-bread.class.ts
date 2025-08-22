import { AbilityService } from "../../../services/ability.service";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

//TO DO: Add all tier 1 faint pet
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
            
            for (let i = 0; i < this.multiplier; i++) {
                let faintPet = this.petService.getRandomFaintPet(pet.parent, 1);
    
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${faintPet.name} (Faint Bread)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent,
                        randomEvent: true
                    }
                )
                if (pet.parent.summonPet(faintPet, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(faintPet);
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