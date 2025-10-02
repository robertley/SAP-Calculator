import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { getOpponent } from "app/util/helper-functions";
import { SnakeAbility } from "../../../abilities/pets/turtle/tier-6/snake-ability.class";

export class Snake extends Pet {
    name = "Snake";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 6;
    initAbilities(): void {
        this.addAbility(new SnakeAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}