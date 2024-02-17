import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Cyclops extends Pet {
    name = "Cyclops";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    anyoneLevelUp(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.parent != this.parent) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${this.level} exp and ${this.level * 2} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        pet.increaseExp(this.level);
        pet.increaseMana(this.level * 2);

        this.superAnyoneLevelUp(gameApi, pet, tiger);
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