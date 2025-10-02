import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Rice } from "../../../equipment/puppy/rice.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Dolphin } from "../../turtle/tier-3/dolphin.class";
import { BelugaSturgeonAbility } from "../../../abilities/pets/puppy/tier-2/beluga-sturgeon-ability.class";

// TODO - bring into lab to determine behavior with spawn and other pet abilities
export class BelugaSturgeon extends Pet {
    name = "Beluga Sturgeon";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
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
    initAbilities(): void {
        this.addAbility(new BelugaSturgeonAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
}