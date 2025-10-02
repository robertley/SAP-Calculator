import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DarwinsFoxAbility } from "../../../abilities/pets/danger/tier-2/darwins-fox-ability.class";

export class DarwinsFox extends Pet {
    name = "Darwin's Fox";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new DarwinsFoxAbility(this, this.logService));
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