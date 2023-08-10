import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-4/orangutang.class";
import { PetService } from "../../../../services/pet.service";

export class FireAnt extends Pet {
    name = "Fire Ant";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 6;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let targets = shuffle(this.parent.petArray.filter(pet => pet != this));

        for (let i = 0; i < this.level; i++) {
            let target = targets[i];
            if (target == null) {
                break;
            }
            target.increaseAttack(this.attack);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${this.attack} attack.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                randomEvent: true
            })
        }
        super.superFaint(gameApi, tiger);
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