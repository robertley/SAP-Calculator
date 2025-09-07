import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bulldog extends Pet {
    name = "Bulldog";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 4;
    afterAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        let attackBonus = this.level * 2;
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseAttack(attackBonus);
        
        this.logService.createLog({
            message: `${this.name} gained +${attackBonus} attack.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
        
        this.abilityUses++;
        this.superAfterAttack(gameApi, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 1;
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