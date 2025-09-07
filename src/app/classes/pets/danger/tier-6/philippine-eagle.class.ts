import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PhilippineEagle extends Pet {
    name = "Philippine Eagle";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 6;
    health = 5;

    friendJumped(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.anyoneJumpedAbility(gameApi, pet, tiger);
        this.superFriendJumped(gameApi, pet, tiger);
    }

    enemyJumped(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.anyoneJumpedAbility(gameApi, pet, tiger);
        this.superEnemyJumped(gameApi, pet, tiger);
    }

    private anyoneJumpedAbility(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
 

        let targetResp = this.parent.getRandomPet([this], false, false, false, this);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        let buffAmount = this.level * 4;
        
        target.increaseAttack(buffAmount);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${buffAmount} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.increaseHealth(buffAmount);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${buffAmount} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
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