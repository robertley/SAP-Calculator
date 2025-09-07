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
        let targetResp = this.parent.opponent.getHighestAttackPet(undefined, this);
        
        // Then jump-attack the highest attack enemy
        if (targetResp.pet && targetResp.pet.alive) {
            this.jumpAttackPrep(targetResp.pet);
            
            // Apply attack gain to transformed pet if transformed, otherwise to target pet
            if (this.transformed && this.transformedInto) {
                let selfTargetResp = this.parent.getThis(this.transformedInto);
                if (selfTargetResp.pet) {        
                    this.transformedInto.increaseAttack(attackGain);
                    this.logService.createLog({
                        message: `${this.name} gave ${this.transformedInto.name} ${attackGain} attack`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            } else {
                let selfTargetResp = this.parent.getThis(this);
                if (selfTargetResp.pet) {        
                    selfTargetResp.pet.increaseAttack(attackGain);
                    this.logService.createLog({
                        message: `${this.name} gave ${selfTargetResp.pet.name} ${attackGain} attack`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            }
        }
        this.jumpAttack(targetResp.pet, tiger, undefined, targetResp.random);
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