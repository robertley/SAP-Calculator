import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Spooked } from "../../../equipment/ailments/spooked.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class QuestionMarks extends Pet {
    name = "???";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 2;

    endTurn(gameApi: GameAPI): void {
        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        const target = targetsAheadResp.pets[0];
        const power = this.level;

        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${power} attack and Spooked.`,
            type: 'ability',
            player: this.parent,
            randomEvent: targetsAheadResp.random
        });

        target.increaseAttack(power);
        target.givePetEquipment(new Spooked());
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