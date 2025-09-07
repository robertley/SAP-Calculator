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
        let targetResp = this.parent.opponent.getFurthestUpPet(this);
        if (targetResp.pet == null) {
            return
        }
        let target: Pet;
        if (targetResp.random) {
            target = targetResp.pet;
        } else {
            target = targetResp.pet?.petBehind();
        }
        
        if (target) {
            let damage = this.level * 3;
            this.jumpAttackPrep(target)
            this.jumpAttack(target, tiger, damage, targetResp.random);
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