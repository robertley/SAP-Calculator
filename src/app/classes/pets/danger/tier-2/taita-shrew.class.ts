import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weasel } from "../../golden/tier-3/weasel.class";

export class TaitaShrew extends Pet {
    name = "Taita Shrew";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        
        if (!target) {
            return;
        }
        
        let weasel = new Weasel(this.logService, this.abilityService, this.parent, target.health, target.attack, target.mana, target.exp, target.equipment);
        
        this.logService.createLog({
            message: `${this.name} transformed ${target.name} into ${weasel.name} (level ${this.level}).`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
        
        this.parent.transformPet(target, weasel);
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