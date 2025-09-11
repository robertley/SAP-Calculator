import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BombusDahlbomii extends Pet {
    name = "Bombus Dahlbomii";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 1;
    health = 2;
    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 
        
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        if (!tiger) {
            this.abilityCounter++;
        }
        
        // Check if counter reached (every 2 attacks)
        if (this.abilityCounter % 2 != 0) {
            this.superEnemyAttack(gameApi, pet, tiger);
            return;
        }
        
        // Set counter event to deal damage
        this.abilityService.setCounterEvent({
            callback: () => {
                let targetResp = this.parent.opponent.getFurthestUpPet(this); // First enemy
                let target = targetResp.pet;
                if (target) {
                    let damage = this.level * 1;
                    this.snipePet(target, damage, targetResp.random, tiger);
                }
            },
            priority: this.attack,
            pet: this
        });
        
        this.abilityUses++;
        this.superEnemyAttack(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 2;
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