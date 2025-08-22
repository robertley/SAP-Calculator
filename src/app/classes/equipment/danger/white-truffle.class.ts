import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class WhiteTruffle extends Equipment {
    name = 'White Truffle';
    equipmentClass = 'faint' as EquipmentClass;
    
    callback = (pet: Pet) => {
        let originalFriendFaints = pet.originalFriendFaints?.bind(pet);
        pet.friendFaints = (gameApi, faintedPet, tiger) => {
            if (faintedPet == pet) {
                return;
            }
            if (originalFriendFaints != null) {
                originalFriendFaints(gameApi, faintedPet, tiger);
            }
            
            // Check if equipment is still equipped and has uses remaining
            if (pet.equipment?.name != 'White Truffle') {
                return;
            }
            
            // Jump-attack the highest attack enemy
            let targetResp = pet.parent.opponent.getHighestAttackPet();
            if (targetResp.pet && targetResp.pet.alive) {
                pet.jumpAttackPrep(targetResp.pet)
                pet.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
                pet.removePerk();
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super();
    }
}