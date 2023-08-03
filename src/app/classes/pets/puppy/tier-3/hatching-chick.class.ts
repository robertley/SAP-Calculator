import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HatchingChick extends Pet {
    name = "Hatching Chick";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 2;
    endTurn(gameApi: GameAPI): void {
        if (this.level > 1) {
            return;
        }
        let target = this.petAhead;
        if (target == null) {
            return;
        }

        target.increaseAttack(4);
        target.increaseHealth(4);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${4} attack and ${4} health.`,
            type: 'ability',
            player: this.parent
        })
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