import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AngryPygmyHog } from "../../hidden/angry-pygmy-hog.class";
import { Garlic } from "../../../equipment/turtle/garlic.class";

export class PygmyHog extends Pet {
    name = "Pygmy Hog";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 1;
    health = 2;
    private attackCounter = 0;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 
        
        
        if (!tiger) {
            this.attackCounter++;
        }
        
        // Check if counter reached (every 5 attacks)
        if (this.attackCounter % 5 != 0) {
            this.superEnemyAttack(gameApi, pet, tiger);
            return;
        }
        
        // Set counter event to transform
        this.abilityService.setCounterEvent({
            callback: () => {
                let transformedStats = this.level * 5; // 5/5, 10/10, 15/15
                let angryPygmyHog = new AngryPygmyHog(this.logService, this.abilityService, this.parent, transformedStats, transformedStats, this.mana, this.exp, new Garlic());
                
                this.logService.createLog({
                    message: `${this.name} transformed into ${angryPygmyHog.name} (${transformedStats}/${transformedStats}) with Garlic!`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
                
                this.parent.transformPet(this, angryPygmyHog);
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