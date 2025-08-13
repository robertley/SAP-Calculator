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
        let target = this.petAhead;
        if (!target) {
            return;
        }
        if (this.parent.pet0 != null) {
            return;
        }
        this.parent.pushPet(target, 4);
        this.logService.createLog({
            message: `${this.name} pushed ${target.name} to the front.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        });
        let power = this.level * 4;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} health.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
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