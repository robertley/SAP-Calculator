import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ibex extends Pet {
    name = "Ibex";
    tier = 5;
    pack: Pack = 'Star';
    attack = 6;
    health = 7;
    //TO DO: Refactor these private stuff into pet memory
    private affectedEnemies: Set<Pet> = new Set();

    private processEnemyTrigger(pet: Pet, tiger?: boolean): void {
        // Check if enemy already affected this battle
        if (this.affectedEnemies.has(pet)) {
            return;
        }
        
        // Check if we've reached our limit
        if (this.affectedEnemies.size >= this.maxAbilityUses) {
            return;
        }
        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        if (target == null) {
            return
        }
        // Calculate 70% health reduction
        let healthReduction = Math.floor(pet.health * 0.7);
        
        // Apply damage
        target.increaseHealth(-healthReduction);
        
        // TO DO: Check which pet to add for silly interaction
        this.affectedEnemies.add(target);
        
        // Log the effect
        this.logService.createLog({
            message: `${this.name} removed ${healthReduction} health from ${pet.name} (70%)`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
    }

    enemyHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!pet?.alive) {
            return;
        }
        this.processEnemyTrigger(pet, tiger);
        this.superEnemyHurt(gameApi, pet, tiger);
    }

    enemyPushed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!pet?.alive) {
            return;
        }
        this.processEnemyTrigger(pet, tiger);
        this.superEnemyPushed(gameApi, pet, tiger);
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