import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tucuxi extends Pet {
    name = "Tucuxi";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        // Get target for push effect
        let pushTargetResp = this.parent.getLastPet([this], this);
        let pushTarget = pushTargetResp.pet;
        
        // Safety check for push target
        if (!pushTarget) {
            return;
        }

        // Push target to front (this will handle occupied front slot automatically)
        this.parent.pushPetToFront(pushTarget, false);
        
        this.logService.createLog({
            message: `${this.name} pushed ${pushTarget.name} to the front`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: pushTargetResp.random
        });

        // Get target for buff effect (could be different if Silly)
        let buffTargetResp = this.parent.getLastPet([this], this);
        let buffTarget = buffTargetResp.pet;
        
        // Safety check for buff target
        if (!buffTarget) {
            return;
        }

        // Give level-based buffs (3/6/9 attack and health)
        let power = this.level * 3;
        buffTarget.increaseAttack(power);
        buffTarget.increaseHealth(power);
        
        this.logService.createLog({
            message: `${this.name} gave ${buffTarget.name} +${power} attack and +${power} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: buffTargetResp.random
        });

        this.superFaint(gameApi, tiger);
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