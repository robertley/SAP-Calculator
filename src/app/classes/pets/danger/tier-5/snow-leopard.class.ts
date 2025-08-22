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
        let randomTarget = this.parent.opponent.getRandomPet([], false, true);
        
        // Then jump-attack random enemy
        if (randomTarget && randomTarget.alive) {
            this.jumpAttackPrep(randomTarget)
            if (this.transformed && this.transformedInto) {
                this.transformedInto.increaseAttack(statGain);
                this.transformedInto.increaseHealth(statGain);
                this.logService.createLog({
                    message: `${this.transformedInto.name} gained ${statGain} attack and ${statGain} health`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
            } else {
                this.increaseAttack(statGain);
                this.increaseHealth(statGain);
                this.logService.createLog({
                    message: `${this.name} gained ${statGain} attack and ${statGain} health`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
            }
            this.jumpAttack(randomTarget, tiger, null, true);
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