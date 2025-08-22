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
        
        // Set counter event to deal damage
        this.abilityService.setCounterEvent({
            callback: () => {
                let damage = Math.floor(this.health * 0.33); // 33% of current health
                let targets = this.parent.opponent.getLowestHealthPets(this.level);
                
                for (let target of targets) {
                    this.snipePet(target, damage, true, tiger);
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