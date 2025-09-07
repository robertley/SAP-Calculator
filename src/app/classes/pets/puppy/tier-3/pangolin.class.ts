import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
            this.superFaint(gameApi, tiger);
            return;
        }
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        if (targetsBehindResp.pets.length === 0) {
            this.superFaint(gameApi, tiger);
            return;
        }
        let target = targetsBehindResp.pets[0];
        let power = this.level * 4;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsBehindResp.random
        });
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