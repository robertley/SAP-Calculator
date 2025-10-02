import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EuropeanMinkAbility } from "../../../abilities/pets/danger/tier-2/european-mink-ability.class";

export class EuropeanMink extends Pet {
    name = "European Mink";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;
    initAbilities(): void {
        this.addAbility(new EuropeanMinkAbility(this, this.logService));
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