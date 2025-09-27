import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MothmanAbility } from "../../../abilities/pets/unicorn/tier-2/mothman-ability.class";

export class Mothman extends Pet {
    name = "Mothman";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 2;

    initAbilities(): void {
        this.addAbility(new MothmanAbility(this, this.logService));
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 5;
    }
}