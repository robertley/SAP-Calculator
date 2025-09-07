import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TasmanianDevil extends Pet {
    name = "Tasmanian Devil";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 5;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let percentage = this.level * 0.5; // 50%/100%/150%
        let targetResp = this.parent.opponent.getLowestAttackPet(undefined, this);
        
        if (targetResp.pet && targetResp.pet.alive) {
            let damage = Math.floor(this.attack * percentage);
            this.jumpAttackPrep(targetResp.pet)
            if (this.transformed && this.transformedInto) {
                damage = Math.floor(this.transformedInto.attack * percentage);
            }
            this.jumpAttack(targetResp.pet, tiger, damage, targetResp.random);
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