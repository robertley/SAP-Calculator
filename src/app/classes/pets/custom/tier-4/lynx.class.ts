import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LynxAbility } from "../../../abilities/pets/custom/tier-4/lynx-ability.class";

export class Lynx extends Pet {
    name = "Lynx";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 5;
    health = 3;
    initAbilities(): void {
        this.addAbility(new LynxAbility(this, this.logService));
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