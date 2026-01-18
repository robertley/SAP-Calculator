import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlowfishAbility } from "../../../abilities/pets/turtle/tier-4/blowfish-ability.class";

export class Blowfish extends Pet {
    name = "Blowfish";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 6;
    initAbilities(): void {
        this.addAbility(new BlowfishAbility(this, this.logService));
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