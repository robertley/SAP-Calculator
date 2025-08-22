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

    private gainHealthFromEvent(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive || this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let healthGain = this.level * 2;
        this.increaseHealth(healthGain);
        
        this.logService.createLog({
            message: `${this.name} gained ${healthGain} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.abilityUses++;
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3;
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