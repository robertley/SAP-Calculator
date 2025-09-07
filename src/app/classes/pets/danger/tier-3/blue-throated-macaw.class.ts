import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BlueThroatedMacaw extends Pet {
    name = "Blue-Throated Macaw";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;

    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        
        if (!target) {
            this.superFriendTransformed(gameApi, pet, tiger);
            return;
        }
        
        let attackGain = 2 * this.level;
        let healthGain = 1 * this.level;
        
        target.increaseAttack(attackGain);
        target.increaseHealth(healthGain);
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${attackGain} attack and +${healthGain} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
        
        this.superFriendTransformed(gameApi, pet, tiger);
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