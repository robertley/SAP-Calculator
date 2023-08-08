import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Silkmoth extends Pet {
    name = "Silkmoth";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 3;
    health = 1;
    maxAbilityUses: number = 2;
    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (pet != this.petAhead) {
            return;
        }
        if (!pet.alive) {
            return;
        }
        let power = this.level;
        pet.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        this.superFriendHurt(gameApi, pet, tiger);

    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}