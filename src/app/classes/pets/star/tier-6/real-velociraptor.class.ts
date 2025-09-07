import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RealVelociraptor extends Pet {
    name = "Real Velociraptor";
    tier = 6;
    pack: Pack = 'Star';
    attack = 6;
    health = 5;
    //TO DO: Refactor this into pet memory
    private friendAppliedThisTurn: Set<Pet> = new Set();

    friendLostPerk(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {  
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        if (this == pet || !pet?.lastLostEquipment || this.friendAppliedThisTurn.has(pet)) {
            return;
        }
        
        // Create new instance of the lost equipment
        let restoredPerk = this.createEquipmentInstance(pet.lastLostEquipment);
        if (restoredPerk) {
            let targetResp = this.parent.getSpecificPet(this, pet);
            let target = targetResp.pet;
            if (target == null) {
                return
            }
            target.givePetEquipment(restoredPerk);
            
            this.logService.createLog({
                message: `${this.name} returned ${restoredPerk.name} to ${target.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
            this.friendAppliedThisTurn.add(target);
            this.abilityUses++;
        }
        
        super.superFriendLosPerk(gameApi, pet, tiger);
    }

    /**
     * Creates a new instance of equipment based on the equipment class
     */
    private createEquipmentInstance(equipment: Equipment): Equipment | null {
        try {
            // Get the constructor of the equipment
            const EquipmentClass = equipment.constructor as new () => Equipment;
            return new EquipmentClass();
        } catch (error) {
            console.warn('Failed to create equipment instance:', equipment.name, error);
            return null;
        }
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level; 
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}