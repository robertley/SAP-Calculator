import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { GerenukAbility } from "../../../abilities/pets/custom/tier-3/gerenuk-ability.class";

export class Gerenuk extends Pet {
    name = "Gerenuk";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;

    override initAbilities(): void {
        this.addAbility(new GerenukAbility(this, this.logService));
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
