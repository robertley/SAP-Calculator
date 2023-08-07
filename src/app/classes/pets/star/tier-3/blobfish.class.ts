import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Blobfish extends Pet {
    name = "Blobfish";
    tier = 3;
    pack: Pack = 'Star';
    attack = 2;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let target = this.petBehind();
        if (target == null) {
            return;
        }
        let power = this.level;
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} exp.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        target.increaseExp(power);
        this.superFaint(gameApi, tiger);
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