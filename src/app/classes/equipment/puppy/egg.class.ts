import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Nest } from "../../pets/hidden/nest.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Egg extends Equipment {
    name = 'Egg';
    tier = 1;
    equipmentClass: EquipmentClass = 'snipe';
    uses = 1;
    originalUses = 1;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let opponentPets = attackedPet.parent.petArray;
        let attackPet: Pet = null;
        for (let pet of opponentPets) {
            if (pet.alive) {
                attackPet = pet;
                break;
            }
        }

        if (attackPet == null) {
            console.warn("egg didn't find target") // p sure this should never happen?
            return;
        }
        
        let damageResp = pet.calculateDamgae(attackPet, pet.getManticoreMult(), 2, true);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        attackPet.health -= damage;

        let message = `${pet.name} sniped ${attackPet.name} for ${damage}`;
        if (pet instanceof Panther) {
            message += ` (Panther)`;
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

        // hurt ability
        if (attackPet.hurt != null) {
            this.abilityService.setHurtEvent({
                callback: attackPet.hurt.bind(attackPet),
                priority: attackPet.attack,
                player: attackPet.parent,
                callbackPet: attackedPet
            })
        }
        // knockout
        if (attackPet.health < 1 && pet.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: pet.knockOut.bind(pet),
                priority: pet.attack,
                callbackPet: attackPet
            })
        }

        // friend hurt ability
        if (attackPet.alive) {
            this.abilityService.triggerFriendHurtEvents(attackedPet.parent, attackedPet);
        }

        // enemy hurt ability
        if (attackPet.alive && damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(pet.parent, attackPet);
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}