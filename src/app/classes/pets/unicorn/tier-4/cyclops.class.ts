import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CyclopsAbility } from "../../../abilities/pets/unicorn/tier-4/cyclops-ability.class";

export class Cyclops extends Pet {
    name = "Cyclops";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 5;
    initAbilities(): void {
        this.addAbility(new CyclopsAbility(this, this.logService));
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
    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}