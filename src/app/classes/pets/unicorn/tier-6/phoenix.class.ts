import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { YoungPhoenix } from "../../hidden/young-phoenix.class";
import { PhoenixFaintAbility } from "../../../abilities/pets/unicorn/tier-6/phoenix-faint-ability.class";
import { PhoenixAfterFaintAbility } from "../../../abilities/pets/unicorn/tier-6/phoenix-afterfaint-ability.class";

export class Phoenix extends Pet {
    name = "Phoenix";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 8;
    health = 8;
    initAbilities(): void {
        this.addAbility(new PhoenixFaintAbility(this, this.logService));
        this.addAbility(new PhoenixAfterFaintAbility(this, this.logService, this.abilityService));
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