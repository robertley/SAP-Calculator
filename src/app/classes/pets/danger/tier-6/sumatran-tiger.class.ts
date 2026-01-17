import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SumatranTigerAbility } from "../../../abilities/pets/danger/tier-6/sumatran-tiger-ability.class";

export class SumatranTiger extends Pet {
    name = "Sumatran Tiger";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 9;
    health = 9;

    initAbilities(): void {
        this.addAbility(new SumatranTigerAbility(this, this.logService));
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