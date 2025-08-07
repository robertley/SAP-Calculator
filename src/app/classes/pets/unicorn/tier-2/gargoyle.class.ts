import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Gargoyle extends Pet {
    name = "Gargoyle";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power = this.mana * this.level;
        power = power + 2 * this.level;

        let target = this.petBehind();

        if (target == null) {
            return;
        }
        
        this.logService.createLog({
            message: `${this.name} spent ${this.mana} mana and gave ${power} health to ${target.name}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        target.increaseHealth(power);

        this.mana = 0;

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