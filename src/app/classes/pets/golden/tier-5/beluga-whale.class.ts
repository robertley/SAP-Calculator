import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";

export class BelugaWhale extends Pet {
    name = "Beluga Whale";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 3;
    health = 8;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.belugaSwallowedPet == null) {
            super.superAfterFaint(gameApi, tiger, pteranodon);
            return;
        }

        let spawnPet = this.petService.createPet({
            attack: null,
            equipment: null,
            exp: this.minExpForLevel,
            health: null,
            name: this.belugaSwallowedPet,
            mana: 0
        }, this.parent);

        this.logService.createLog(
            {
                message: `${this.name} spawned ${spawnPet.name} Level ${this.level}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

        if (this.parent.summonPet(spawnPet, this.savedPosition)) {
            this.abilityService.triggerFriendSummonedEvents(spawnPet);
        }

        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        swallowedPet?: string) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
        this.belugaSwallowedPet = swallowedPet;
    }
}