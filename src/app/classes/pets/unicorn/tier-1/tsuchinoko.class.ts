import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tsuchinoko extends Pet {
    name = "Tsuchinoko";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        this.parent.pushPetToFront(this, true);
        this.logService.createLog({
            message: `${this.name} pushed itself to the front and gained ${this.level} experience.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.increaseExp(this.level);

        this.superStartOfBattle(gameApi, tiger);
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