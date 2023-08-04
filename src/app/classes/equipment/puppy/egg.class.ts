import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Egg extends Equipment {
    name = 'Egg';
    equipmentClass: EquipmentClass = 'snipe';
    uses = 1;
    originalUses = 1;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let attackPet = attackedPet.parent.getPetAtPosition(0);
        if (attackPet == null) {
            console.warn("egg didn't find target") // p sure this should never happen?
            return;
        }
        
        let damageResp = pet.calculateDamgae(attackPet, 2);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        attackPet.health -= damage;

        let message = `${pet.name} snipes ${attackPet.name} for ${damage}`;
        if (pet instanceof Panther) {
            let multiplier = 1 + pet.level;
            message += ` x${multiplier} (Panther)`;
        }

        if (defenseEquipment != null) {
            attackPet.useDefenseEquipment();
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            message += ` (${defenseEquipment.name} ${sign}${power})`;
        }

        this.logService.createLog({
            message: message += ` (Egg).`,
            type: 'attack',
            player: pet.parent
        })
    }

    constructor(
        protected logService: LogService
    ) {
        super()
    }
}