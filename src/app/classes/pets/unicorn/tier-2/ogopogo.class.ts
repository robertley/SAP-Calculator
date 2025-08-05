import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ogopogo extends Pet {
    name = "Ogopogo";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.furthestUpPet;
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${this.level} exp.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        target.increaseExp(this.level);

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