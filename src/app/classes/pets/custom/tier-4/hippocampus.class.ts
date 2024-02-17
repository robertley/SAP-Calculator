import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hippocampus extends Pet {
    name = "Hippocampus";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 2;
    health = 4;
    friendGainsHealth(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 2;
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} attack.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        pet.increaseAttack(power);
        this.superFriendGainsHealth(gameApi, pet, tiger);
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