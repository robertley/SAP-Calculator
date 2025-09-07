import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hedgehog extends Pet {
    name = "Hedgehog";
    tier = 2;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    faint(gameApi: GameAPI, tiger, pteranodon?: boolean) {
        let targetsResp = this.parent.getAll(true, this);
        let targts = targetsResp.pets
        if (targts.length == 0) {
            return;
        }
        let damage = this.level * 2;
        for (let pet of targts) {
            this.snipePet(pet, damage, targetsResp.random, tiger, pteranodon);
        }

        super.superFaint(gameApi, tiger);
        this.done = true;
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