import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CrackedEgg } from "../../hidden/cracked-egg.class";
import { SneakyEggAbility } from "../../../abilities/pets/unicorn/tier-1/sneaky-egg-ability.class";

export class SneakyEgg extends Pet {
    name = "Sneaky Egg";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 4;
    initAbilities(): void {
        this.addAbility(new SneakyEggAbility(this, this.logService, this.abilityService));
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