import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GermanShephard extends Pet {
    name = "German Shephard";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 10;
    health = 6;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        let power = Math.floor(this.attack * this.level * .25);
        pet.increaseAttack(power);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} attack.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
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