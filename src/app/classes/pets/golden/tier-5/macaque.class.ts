import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-3/orangutang.class";

export class Macaque extends Pet {
    name = "Macaque";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 12;
        let monke = new Orangutang(this.logService, this.abilityService, this.parent, power, power, 0, this.minExpForLevel, this.equipment);

        let message = `${this.name} spawned Orangutang ${monke.attack}/${monke.health}`;
        if (this.equipment != null) {
            message += ` with ${this.equipment.name}`;
        }
        message += `.`;

        this.logService.createLog(
            {
                message: message,
                type: "ability",
                player: this.parent,
                tiger: tiger
            }
        )
        
        if (this.parent.summonPetInFront(this, monke)) {
            this.abilityService.triggerFriendSummonedEvents(monke);
        }

        this.superStartOfBattle(gameApi, tiger);
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