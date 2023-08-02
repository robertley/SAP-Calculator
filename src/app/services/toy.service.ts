import { Injectable } from "@angular/core";
import { LogService } from "./log.servicee";
import { Player } from "../classes/player.class";
import { Pet } from "../classes/pet.class";
import { Equipment } from "../classes/equipment.class";
import { AbilityService } from "./ability.service";

@Injectable({
    providedIn: 'root'
})
export class ToyService {

    constructor(private logService: LogService, private abilityService: AbilityService) {

    }

    snipePet(pet: Pet, power: number, parent: Player, toyName: string, randomEvent=false) {
        let damageResp = this.calculateDamgae(pet, power);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;
        pet.health -= damage;

        let message = `${toyName} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment()
            message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
        }

        this.logService.createLog({
            message: message,
            type: "attack",
            randomEvent: randomEvent,
            player: parent
        });
        
        // hurt ability
        if (pet.hurt != null) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent
            })
        }
    }

    calculateDamgae(pet: Pet, power?: number): {defenseEquipment: Equipment, damage: number} {
        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' 
        || pet.equipment?.equipmentClass == 'shield' ? pet.equipment : null;

        let defenseAmt = defenseEquipment?.power ?? 0;
        let min = defenseEquipment?.equipmentClass == 'shield' ? 0 : 1;
        let damage = Math.max(min, defenseAmt);
        return {
            defenseEquipment: defenseEquipment,
            damage: damage
        }
    } 

}