import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { BusAbility } from "../../abilities/pets/hidden/bus-ability.class";

export class Bus extends Pet {
    name = "Bus";
    tier = 1;
    pack: Pack = 'Turtle';
    hidden: boolean = true;
    health = 3;
    attack = 5;
    initAbilities(): void {
        this.addAbility(new BusAbility(this, this.logService, this.abilityService));
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
