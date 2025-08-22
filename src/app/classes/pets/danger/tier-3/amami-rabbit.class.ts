import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AmamiRabbit extends Pet {
    name = "Amami Rabbit";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 1;
    health = 3;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let attackGain = this.level * 1;
        let targetResp = this.parent.opponent.getHighestAttackPet();
        

        
        // Then jump-attack the highest attack enemy
        if (targetResp.pet && targetResp.pet.alive) {
            this.jumpAttackPrep(targetResp.pet);
            
            // Gain attack first - apply to transformed pet if transformed
            if (this.transformed && this.transformedInto) {
                this.transformedInto.increaseAttack(attackGain);
                this.logService.createLog({
                    message: `${this.transformedInto.name} gained ${attackGain} attack`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
            } else {
                this.increaseAttack(attackGain);
                this.logService.createLog({
                    message: `${this.name} gained ${attackGain} attack`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
            }
            
            this.jumpAttack(targetResp.pet, tiger);
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