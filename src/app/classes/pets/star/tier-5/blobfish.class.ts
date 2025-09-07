import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Blobfish extends Pet {
    name = "Blobfish";
    tier = 5;
    pack: Pack = 'Star';
    attack = 2;
    health = 10;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetsResp = this.parent.nearestPetsBehind(2, this);
        let targets = targetsResp.pets
        for (let target of targets) {
            let power = this.level;
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} exp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            });
            target.increaseExp(power);    
        }
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