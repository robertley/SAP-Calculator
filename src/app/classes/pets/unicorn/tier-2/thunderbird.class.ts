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
        let targetsResp = this.parent.nearestPetsAhead(2, this);
        let targets = targetsResp.pets;
        if (targets.length < 2) {
            return;
        }
        let target = targetsResp.pets[1];
        if (target == null) {
            return;
        }
        let power = this.level * 3;
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsResp.random
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
