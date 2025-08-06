import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Gecko extends Pet {
    name = "Gecko";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 1;
    toyPet: boolean = true;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.toy == null) {
            return;
        }

        let power = this.level * 2;
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

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