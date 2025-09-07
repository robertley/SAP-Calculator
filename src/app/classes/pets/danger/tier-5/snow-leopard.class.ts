import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SnowLeopard extends Pet {
    name = "Snow Leopard";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 3;
    health = 2;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let statGain = this.level * 5; // 5/10/15
        let targetResp = this.parent.opponent.getRandomPet([], false, true, false, this);
        
        // Then jump-attack random enemy
        if (targetResp.pet && targetResp.pet.alive) {
            this.jumpAttackPrep(targetResp.pet)
            
            // Apply stat gain to transformed pet if transformed, otherwise use Silly-aware self-targeting
            if (this.transformed && this.transformedInto) {
                let selfTargetResp = this.parent.getThis(this.transformedInto);
                if (selfTargetResp.pet) {        
                    this.transformedInto.increaseAttack(statGain);
                    this.transformedInto.increaseHealth(statGain);
                    this.logService.createLog({
                        message: `${this.name} gave ${this.transformedInto.name} ${statGain} attack and ${statGain} health`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            } else {
                let selfTargetResp = this.parent.getThis(this);
                if (selfTargetResp.pet) {        
                    selfTargetResp.pet.increaseAttack(statGain);
                    selfTargetResp.pet.increaseHealth(statGain);
                    this.logService.createLog({
                        message: `${this.name} gave ${selfTargetResp.pet.name} ${statGain} attack and ${statGain} health`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            }
            this.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
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