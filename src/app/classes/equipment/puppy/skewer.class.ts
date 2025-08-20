import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Skewer extends Equipment {
    name = 'Skewer';
    tier = 5;
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        this.skewer(pet, attackedPet, 1);
        this.skewer(pet, attackedPet, 2);
    }

    constructor(private logService: LogService) {
        super()
    }

    skewer(pet: Pet, attackedPet: Pet, position: number) {
        let attackPet = attackedPet.parent.getPetAtPosition(position);
        if (attackPet == null) {
            return;
        }

        let damageResp = pet.calculateDamgae(attackPet, pet.getManticoreMult(), 3);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage * this.multiplier;

        attackPet.dealDamage(damage);

        let message = `${pet.name} attacks ${attackPet.name} for ${damage}`;

        if (this.multiplier > 1) {
            message += ` x${this.multiplier}${this.multiplierMessage}`;
        }

        if (defenseEquipment != null) {
            attackPet.useDefenseEquipment();
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            message += ` (${defenseEquipment.name} ${sign}${power})`;

            // Defense equipment multiplier handled by attacked pet's equipment
    
        }

        this.logService.createLog({
            message: message += ` (Skewer).`,
            type: 'attack',
            player: pet.parent
        })
    }
}