import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { VelociraptorAbility } from "../../../abilities/pets/star/tier-6/velociraptor-ability.class";

export class Velociraptor extends Pet {
    name = "Velociraptor";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;

    initAbilities(): void {
        this.addAbility(new VelociraptorAbility(this, this.logService));
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