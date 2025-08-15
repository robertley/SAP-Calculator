import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class LongcombSawfish extends Pet {
    name = "Longcomb Sawfish";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 3;
    health = 3;
    private attackCounter = 0;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        
        if (!tiger) {
            this.attackCounter++;
        }
        
        // Check if counter reached (every 5 attacks)
        if (this.attackCounter % 5 != 0) {
            this.superEnemyAttack(gameApi, pet, tiger);
            return;
        }
        
        // Set counter event to gain health and remove health from all enemies
        this.abilityService.setCounterEvent({
            callback: () => {
                let healthGain = this.level * 4; // 4/8/12 health gain based on level
                let healthRemoval = this.level * -4; // 4/8/12 health removal based on level
                
                // Gain health
                this.increaseHealth(healthGain);
                
                // Gain health
                this.logService.createLog({
                    message: `${this.name} gained ${healthGain} health`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
                
                // Remove health from all alive enemies
                let targets = [...this.parent.opponent.petArray];
                targets = targets.filter(enemy => enemy.alive);
                for (let targetPet of targets) {
                    targetPet.increaseHealth(healthRemoval);
                    this.logService.createLog({
                        message: `${this.name} reduced ${targetPet.name} health by ${Math.abs(healthRemoval)}`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    });
                }
                
            },
            priority: this.attack
        });
        
        this.superEnemyAttack(gameApi, pet, tiger);
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