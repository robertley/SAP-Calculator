import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HumphreadWrasse extends Pet {
    name = "Humphead Wrasse";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 6;
    health = 4;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let percentage = 0.3 * this.level; // 30%/60%/90%
        let targetResp = this.parent.opponent.getHighestAttackPet(undefined, this);
        
        if (!targetResp.pet) {
            return;
        }
        
        let target = targetResp.pet;
        let reductionAmount = Math.floor(target.attack * percentage);
        let newAttack = Math.max(1, target.attack - reductionAmount);
        
        target.attack = newAttack;
        
        this.logService.createLog({
            message: `${this.name} reduced ${target.name}'s attack by ${percentage * 100}% to (${target.attack})`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

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