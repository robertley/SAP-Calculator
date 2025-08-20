import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";

export class RedLippedBatfish extends Pet {
    name = "Red Lipped Batfish";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 5;
    health = 3;
    
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // Get the opposite enemy at the same position
        let target = this.parent.opponent.getPetAtPosition(this.position);
        
        if (!target || !target.alive) {
            return;
        }
        
        // Calculate target tier: target's tier - level (1/2/3 tiers below)
        let targetTier = Math.max(1, target.tier - this.level);
        
        // Get random faint pet from the target tier
        let faintPet = this.petService.getRandomFaintPet(target.parent, targetTier);
        
        // Create new pet with the faint pet's name but original target's stats
        let newPet = this.petService.createPet({
            name: faintPet.name,
            attack: target.attack,
            health: target.health,
            exp: target.exp,
            equipment: target.equipment,
            mana: target.mana
        }, target.parent);
        
        // Use proper transformPet method
        this.logService.createLog({
            message: `${this.name} transformed ${target.name} into ${faintPet.name}.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        });
        target.parent.transformPet(target, newPet);
        
        this.superStartOfBattle(gameApi, tiger);
    }
    
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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