import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Thunderbird extends Pet {
    name = "Thunderbird";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.furthestUpPet;
        let power = this.level * 3;
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        target.increaseMana(power);

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