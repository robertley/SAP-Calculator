import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pangolin extends Pet {
    name = "Pangolin";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.toy == null) {
            return;
        }
        if (this.petBehind() == null) {
            return;
        }
        let power = this.level * 5;
        this.petBehind().increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${this.petBehind().name} ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
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