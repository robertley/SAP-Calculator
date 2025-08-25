import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class GrosMichelBanana extends Equipment {
    name = 'Gros Michel Banana';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeAttack =pet.beforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi, tiger) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Gros Michel Banana') {
                return;
            }
            
            // Create Ant with current pet's stats
            let antPet = this.petService.createPet({
                name: "Ant",
                attack: pet.attack,
                health: pet.health,
                mana: pet.mana,
                exp: pet.exp,
                equipment: null
            }, pet.parent);
            
            this.logService.createLog({
                message: `${pet.name} transformed into ${antPet.name} (Gros Michel Banana)`,
                type: 'equipment',
                player: pet.parent
            });
            
            pet.parent.transformPet(pet, antPet);
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