import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AmazonRiverDolphin extends Pet {
    name = "Amazon River Dolphin";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 5;

    adjacentAttacked(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {

        // Choice: Deal damage to its target OR gain attack
        let targetResp = this.parent.getSpecificPet(this, pet.currentTarget);
        let target = targetResp.pet;
        if (target && target.alive) {
            let damage = 3 * this.level;
            this.snipePet(target, damage, targetResp.random, tiger);
        } else {
            let targetResp = this.parent.getThis(this);
            let selfTarget = targetResp.pet;
            
            if (!selfTarget) {
                return;
            }
            
            let attackBonus = 3 * this.level;
            selfTarget.increaseAttack(attackBonus);
            this.logService.createLog({
                message: `${this.name} gave ${selfTarget.name} ${attackBonus} attack`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }
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