import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PygmyHippo extends Pet {
    name = "Pygmy Hippo";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 7;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 
        
        if (!tiger) {
            this.abilityCounter++;
        }
        
        // Check if counter reached (every 5 attacks)
        if (this.abilityCounter % 5 != 0) {
            return;
        }
        
        // Set counter event to deal damage
        this.abilityService.setCounterEvent({
            callback: () => {
                let damage = Math.floor(this.health * 0.33); // 33% of current health
                let targetsResp = this.parent.opponent.getLowestHealthPets(this.level, undefined, this);
                
                for (let target of targetsResp.pets) {
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