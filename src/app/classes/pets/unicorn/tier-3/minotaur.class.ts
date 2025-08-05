import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Minotaur extends Pet {
    name = "Minotaur";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    friendAheadAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * pet.level;

        this.logService.createLog({
            message: `${this.name} gained ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.increaseAttack(power);
        this.increaseHealth(power);

        this.superFriendAheadAttacks(gameApi, pet, tiger);

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