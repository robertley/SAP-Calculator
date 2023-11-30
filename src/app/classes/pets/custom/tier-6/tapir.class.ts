import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tapir extends Pet {
    name = "Tapir";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let elligibleCopyPets = [];
        let donutPets = [];
        for (let pet of this.parent.petArray) {
            if (pet instanceof Tapir) {
                continue;
            }
            if (!pet.alive) {
                continue;
            }
            elligibleCopyPets.push(pet);
        }

        if (elligibleCopyPets.length === 0) {
            return;
        }


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