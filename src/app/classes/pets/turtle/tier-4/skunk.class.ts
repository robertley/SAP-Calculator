import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SkunkAbility } from "../../../abilities/pets/turtle/tier-4/skunk-ability.class";

export class Skunk extends Pet {
    name = "Skunk";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 5;
    initAbilities(): void {
        this.addAbility(new SkunkAbility(this, this.logService));
        super.initAbilities();
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