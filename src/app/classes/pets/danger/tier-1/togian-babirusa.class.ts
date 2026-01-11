import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TogianBabirusaAbility } from "../../../abilities/pets/danger/tier-1/togian-babirusa-ability.class";

export class TogianBabirusa extends Pet {
    name = "Togian Babirusa";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;
    initAbilities(): void {
        this.addAbility(new TogianBabirusaAbility(this, this.logService));
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