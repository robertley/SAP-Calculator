import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Tasty } from "../../../equipment/ailments/tasty.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SeaCucumber extends Pet {
    name = "Sea Cucumber";
    tier = 5;
    pack: Pack = 'Custom';
    health = 5;
    attack = 3;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // Get random enemies
        let opponent = this.parent == gameApi.player ? gameApi.opponet : gameApi.player;
        let enemies = opponent.petArray.filter(enemy => enemy.alive);
        
        if (enemies.length == 0) {
            this.superStartOfBattle(gameApi, tiger);
            return;
        }
        
        let targetCount = this.level; 
        let targetsApplied = 0;
        
        let availableEnemies = [...enemies];
        
        for (let i = 0; i < targetCount && availableEnemies.length > 0; i++) {
            let randomIndex = Math.floor(Math.random() * availableEnemies.length);
            let randomEnemy = availableEnemies[randomIndex];
            
            let tasty = new Tasty(this.logService, this.abilityService);
            
            this.logService.createLog({
                message: `${this.name} made ${randomEnemy.name} Tasty`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: enemies.length > 1
            });
            
            randomEnemy.givePetEquipment(tasty);
            targetsApplied++;
            
            // Remove the targeted enemy from available enemies to prevent duplicates
            availableEnemies.splice(randomIndex, 1);
        }
        
        this.superStartOfBattle(gameApi, tiger);
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