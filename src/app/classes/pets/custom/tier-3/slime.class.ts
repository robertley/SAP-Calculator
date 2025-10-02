import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SmallerSlime } from "../../hidden/smaller-slime.class";
import { SlimeAbility } from "../../../abilities/pets/custom/tier-3/slime-ability.class";

export class Slime extends Pet {
    name = "Slime";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new SlimeAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        triggersConsumed?: number,
        battlesFought?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
        this.battlesFought = battlesFought;
    }
}