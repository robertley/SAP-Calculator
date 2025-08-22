import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Takin extends Pet {
    name = "Takin";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 1;
    health = 2;

    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            this.superFriendHurt(gameApi, pet, tiger);
            return;
        }

        // Check if hurt pet is ahead of this pet (lower position index)
        if (!pet || pet != this.petAhead) {
            return;
        }

        let attackGain = this.level;
        let healthGain = this.level * 2;
        
        this.increaseAttack(attackGain);
        this.increaseHealth(healthGain);

        this.logService.createLog({
            message: `${this.name} gained ${attackGain} attack and ${healthGain} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.superFriendHurt(gameApi, pet, tiger);
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