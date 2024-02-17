import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GreatOne extends Pet {
    name = "Great One";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 7;
    health = 13;
    summoned(gameApi: GameAPI, tiger?: boolean): void {
        let targets = [...this.parent.petArray, ...this.parent.opponent.petArray];
        targets = targets.filter(pet => pet !== this);
        for (let target of targets) {
            this.snipePet(target, this.level * 6);
        }
        this.superSummoned(gameApi, tiger);
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