import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pixiu extends Pet {
    name = "Pixiu";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana < 4) {
            return;
        }

        let power = this.level * 3;

        this.logService.createLog({
            message: `${this.name} spent 4 mana and gained ${power} gold for next turn.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.mana -= 4;

        this.superFaint(gameApi, tiger);
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