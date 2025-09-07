import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SumatranTiger extends Pet {
    name = "Sumatran Tiger";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 8;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetResp = this.parent.getOppositeEnemyPet(this);
        let oppositeEnemy = targetResp.pet;
        
        if (oppositeEnemy) {
            // Jump-attack the opposite enemy
            this.jumpAttackPrep(oppositeEnemy)
            this.jumpAttack(oppositeEnemy, tiger, null, targetResp.random);
            
            // Level 2 and 3: Deal damage to adjacent enemies
            if (this.level >= 2) {
                let damage = this.level == 2 ? 6 : 12; // 6 for level 2, 12 for level 3
                let adjacentTargets: Pet[] = [];
                if (targetResp.random) {
                    //TO DO: Swap to silly targetting
                    adjacentTargets = this.parent.getRandomLivingPets(2).pets
                } else {
                    // Get pet behind target (higher position number)
                    let petBehind = oppositeEnemy.petBehind();
                    if (petBehind && petBehind.alive) {
                        adjacentTargets.push(petBehind);
                    }
                    
                    // Get pet in front of target (lower position number)  
                    let petInFront = oppositeEnemy.petAhead;
                    if (petInFront && petInFront.alive) {
                        adjacentTargets.push(petInFront);
                    }
                }
                // Deal damage to all adjacent enemies
                for (let adjacentTarget of adjacentTargets) {
                    this.snipePet(adjacentTarget, damage, targetResp.random, tiger);
                }
            }
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