import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class FlyingSquirrel extends Pet {
    name = "Flying Squirrel";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    friendlyToyBroke(gameApi: GameAPI, tiger?: boolean): void {
        this.logService.createLog({
            message: `${this.parent.toy.name} respawned!`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendlyToyBroke(gameApi, tiger);
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