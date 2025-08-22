import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AfricanWildDog extends Pet {
    name = "African Wild Dog";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 1;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.opponent.furthestUpPet?.petBehind();
        
        if (target && target.alive) {
            let damage = this.level * 3;
            this.jumpAttackPrep(target)
            this.jumpAttack(target, tiger, damage);
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