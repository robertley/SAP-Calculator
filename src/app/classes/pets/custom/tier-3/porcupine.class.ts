import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Porcupine extends Pet {
    name = "Porcupine";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 6;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = 3 * this.level;
        if (pet == null || !pet.alive){
            return;
        }
        this.snipePet(pet, power);
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