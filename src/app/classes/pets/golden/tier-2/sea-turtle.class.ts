import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SeaTurtle extends Pet {
    name = "Sea Turtle";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 2;
    health = 5;
    friendSummoned(pet: Pet, tiger?: boolean): void {
        let power = this.level * 3
        pet.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} health.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })
        this.superFriendSummoned(pet, tiger);
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