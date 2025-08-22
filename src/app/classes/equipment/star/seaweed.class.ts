import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Seaweed extends Equipment {
    name = 'Seaweed';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Seaweed') {
                return;
            }
            
            // Create Baby Urchin with current pet's stats
            let babyUrchinPet = this.petService.createPet({
                name: "Baby Urchin",
                attack: pet.attack,
                health: pet.health,
                mana: pet.mana,
                exp: pet.exp,
                equipment: null
            }, pet.parent);
            
            this.logService.createLog({
                message: `${pet.name} transformed into ${babyUrchinPet.name} (Seaweed)`,
                type: 'equipment',
                player: pet.parent
            });
            
            pet.parent.transformPet(pet, babyUrchinPet);
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super();
    }
}