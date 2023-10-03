import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ladybug extends Pet {
    name = "Ladybug";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 3;
    friendGainedPerk(gameApi: GameAPI, pet, tiger?: boolean): void {
        let power = this.level * 2;
        this.increaseAttack(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} attack.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendGainedPerk(gameApi, pet, tiger);
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