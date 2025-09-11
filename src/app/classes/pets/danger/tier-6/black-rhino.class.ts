import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BlackRhino extends Pet {
    name = "Black Rhino";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 5;
    health = 9;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 
        
        if (!tiger) {
            this.abilityCounter++;
        }
        
        // Check if counter reached (every 8 attacks)
        if (this.abilityCounter % 8 != 0) {
            this.superEnemyAttack(gameApi, pet, tiger);
            return;
        }
        
        this.abilityService.setCounterEvent({
            callback: () => {
                let damage = 30; // Fixed 30 damage
                
                // Get all alive enemies and shuffle for random selection
                let targetsResp = this.parent.opponent.getRandomPets(this.level, [], false, true, this)
                let targets = targetsResp.pets
                for (let target of targets) {
                    this.snipePet(target, damage, targetsResp.random, tiger);
                }
            },
            priority: this.attack,
            pet: this
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