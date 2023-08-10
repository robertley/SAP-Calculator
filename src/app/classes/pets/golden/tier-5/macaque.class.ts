import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-4/orangutang.class";

export class Macaque extends Pet {
    name = "Macaque";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let monke = new Orangutang(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel, cloneDeep(this.equipment));

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
        
        if (this.parent.summonPet(monke, this.position)) {
            this.abilityService.triggerSummonedEvents(monke);
        };

        this.superStartOfBattle(gameApi, tiger);
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