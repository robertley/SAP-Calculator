import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pteranodon extends Pet {
    name = "Pteranodon";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 5;
    health = 3;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.faint == null) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        pet.faint(gameApi, false, true);
        this.abilityUses++;
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
    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}