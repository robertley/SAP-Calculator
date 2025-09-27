import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LuckyCatAbility } from "../../../abilities/pets/unicorn/tier-3/lucky-cat-ability.class";

export class LuckyCat extends Pet {
    name = "Lucky Cat";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    initAbilities(): void {
        this.addAbility(new LuckyCatAbility(this, this.logService));
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