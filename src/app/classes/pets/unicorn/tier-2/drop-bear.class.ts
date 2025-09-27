import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DropBearAbility } from "../../../abilities/pets/unicorn/tier-2/drop-bear-ability.class";

export class DropBear extends Pet {
    name = "Drop Bear";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new DropBearAbility(this, this.logService));
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