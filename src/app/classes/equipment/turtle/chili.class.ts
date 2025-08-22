import { cloneDeep } from "lodash";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Chili extends Equipment {
    name = 'Chili';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    originalPower = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let attackPet = attackedPet.parent.getPetAtPosition(1);
        if (attackPet == null) {
            return;
        }

        let damageResp = pet.calculateDamgae(attackPet, pet.getManticoreMult(), 5);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage * this.multiplier;

        pet.dealDamage(attackPet, damage);

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
            message: message += ` (Chili).`,
            type: 'attack',
            player: pet.parent
        })

        // hurt ability
        if (attackPet.hurt != null && damage > 0) {
            this.abilityService.setHurtEvent({
                callback: attackPet.hurt.bind(attackPet),
                priority: attackPet.attack,
                player: attackPet.parent,
                callbackPet: attackedPet,
                pet: attackPet
            })
        }
        // knockout
        if (attackPet.health < 1 && pet.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: pet.knockOut.bind(pet),
                priority: pet.attack,
                callbackPet: attackPet,
                pet: pet
            })
        }

        // friend hurt ability
        if (attackPet.alive && damage > 0) {
            this.abilityService.triggerFriendHurtEvents(attackedPet.parent, attackPet);
        }

        // enemy hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(pet.parent, attackPet);
        }
    }

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super()
    }
}