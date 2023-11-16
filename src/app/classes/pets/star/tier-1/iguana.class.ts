import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Iguana extends Pet {
    name = "Iguana";
    tier = 2;
    pack: Pack = 'Star';
    attack = 3;
    health = 3;
    // Using the summonPet method when pushing, so this works on push, too.
    // might need to revisit later.
    enemySummoned(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet == null) {
            return;
        }
        if (!pet.alive) {
            return;
        }
        let power = this.level * 2;
        this.snipePet(pet, power, false, tiger);
        this.superEnemySummoned(gameApi, pet, tiger);
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