import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AraripeManakin extends Pet {
    name = "Araripe Manakin";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    friendJumped(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.gainHealthFromEvent(gameApi, pet, tiger);
        this.superFriendJumped(gameApi, pet, tiger);
    }

    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.gainHealthFromEvent(gameApi, pet, tiger);
        this.superFriendTransformed(gameApi, pet, tiger);
    }
    //TO DO: Have parrot handle private function, handle activation for this
    private gainHealthFromEvent(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        
        if (!target) {
            return;
        }

        let healthGain = this.level * 3;
        target.increaseHealth(healthGain);
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${healthGain} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        this.abilityUses++;
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 2;
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