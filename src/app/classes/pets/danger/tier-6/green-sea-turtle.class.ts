import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Melon } from "../../../equipment/turtle/melon.class";

export class GreenSeaTurtle extends Pet {
    name = "Green Sea Turtle";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 5;
    health = 6;
    private attackCounter = 0;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 
        
        if (this.abilityUses >= this.maxAbilityUses) {
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
        
        this.abilityService.setCounterEvent({
            callback: () => {
                // Give all friendly pets Melon
                let targetsResp = this.parent.getAll(false, this);
                let targets = targetsResp.pets;
                for (let targetPet of targets) {
                    
                    targetPet.givePetEquipment(new Melon(), this.level);
                    this.logService.createLog({
                        message: `${this.name} gave ${targetPet.name} Melon.`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    });
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
        this.maxAbilityUses = 1; // 1 time per turn
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