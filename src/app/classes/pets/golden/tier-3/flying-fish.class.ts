import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class FlyingFish extends Pet {
    name = "Flying Fish";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    maxAbilityUses: number = 2;
    friendSummoned(pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let power = this.level * 2;
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} exp.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        pet.increaseExp(power);
        this.abilityUses++;
        this.superFriendSummoned(pet, tiger);
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}