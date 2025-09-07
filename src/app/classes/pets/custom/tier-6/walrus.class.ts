import { PeanutButter } from "app/classes/equipment/hidden/peanut-butter";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Walrus extends Pet {
    name = "Walrus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 7;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetsResp = this.parent.getRandomPets(this.level, null, true, false, this);
        for (let target of targetsResp.pets) {
            if (target != null) {
                target.givePetEquipment(new PeanutButter());
                this.logService.createLog({
                    message: `${this.name} gave ${target.name} a Peanut Butter.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: targetsResp.random
                })
            }
        }
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