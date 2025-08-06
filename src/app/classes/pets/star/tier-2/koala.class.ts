import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Koala extends Pet {
    name = "Koala";
    tier = 2;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    maxAbilityUses = 1;
    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses && !tiger) return;
        pet.increaseAttack(this.level);
        pet.increaseHealth(this.level);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${this.level} attack and ${this.level} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses += 1;
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