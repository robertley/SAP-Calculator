import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MonkeyFacedBatAbility } from "../../../abilities/pets/danger/tier-3/monkey-faced-bat-ability.class";

export class MonkeyFacedBat extends Pet {
    name = "Monkey-Faced Bat";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new MonkeyFacedBatAbility(this, this.logService));
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