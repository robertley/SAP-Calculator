import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HammerheadSharkAbility } from "../../../abilities/pets/custom/tier-6/hammerhead-shark-ability.class";

export class HammerheadShark extends Pet {
    name = "Hammerhead Shark";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 5;
    health = 5;
    initAbilities(): void {
        this.addAbility(new HammerheadSharkAbility(this, this.logService, this.abilityService));
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