import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Emu extends Pet {
    name = "Emu";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.pet0 != null) {
            return;
        }

        let buffTargetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (buffTargetsAheadResp.pets.length == 0) {
            return;
        }
        let buffTarget = buffTargetsAheadResp.pets[0];
        let power = this.level * 4;
        buffTarget.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${buffTarget.name} ${power} health.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: buffTargetsAheadResp.random
        });

        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        this.parent.pushPet(target, 4);
        this.logService.createLog({
            message: `${this.name} pushed ${target.name} to the front.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });
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