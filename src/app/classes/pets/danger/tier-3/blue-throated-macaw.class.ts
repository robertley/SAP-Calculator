import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlueThroatedMacawAbility } from "../../../abilities/pets/danger/tier-3/blue-throated-macaw-ability.class";

export class BlueThroatedMacaw extends Pet {
    name = "Blue-Throated Macaw";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new BlueThroatedMacawAbility(this, this.logService));
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