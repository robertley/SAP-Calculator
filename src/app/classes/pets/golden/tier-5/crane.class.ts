import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Melon } from "../../../equipment/turtle/melon.class";

export class Crane extends Pet {
    name = "Crane";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 6;
    health = 5;
    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet != this.petAhead) {
            return;
        }

        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        this.petAhead.increaseAttack(5);
        this.logService.createLog({
            message: `${this.name} gave ${this.petAhead.name} 5 attack.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })
        this.petAhead.givePetEquipment(new Melon());
        this.logService.createLog({
            message: `${this.name} gave ${this.petAhead.name} a Melon.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        this.superFriendHurt(gameApi, pet, tiger);

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