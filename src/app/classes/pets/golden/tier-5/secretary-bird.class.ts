import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SecretaryBirdAbility } from "../../../abilities/pets/golden/tier-5/secretary-bird-ability.class";

export class SecretaryBird extends Pet {
    name = "Secretary Bird";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 3;
    health = 5;
    initAbilities(): void {
        this.addAbility(new SecretaryBirdAbility(this, this.logService));
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