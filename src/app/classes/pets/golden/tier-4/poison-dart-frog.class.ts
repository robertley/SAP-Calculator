import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PoisonDartFrogAbility } from "../../../abilities/pets/golden/tier-4/poison-dart-frog-ability.class";

export class PoisonDartFrog extends Pet {
    name = "Poison Dart Frog";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 5;
    health = 2;

    initAbilities(): void {
        this.addAbility(new PoisonDartFrogAbility(this, this.logService));
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