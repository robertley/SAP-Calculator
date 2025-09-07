import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Microbe extends Pet {
    name = "Microbe";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 1;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetsResp = this.parent.getAll(true, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Weak.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            })
            pet.givePetEquipment(new Weak());
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