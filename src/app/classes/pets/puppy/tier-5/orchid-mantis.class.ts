import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PrayingMantis} from "../../star/tier-4/praying-mantis.class";

export class OrchidMantis extends Pet {
    name = "Orchid Mantis";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let attack =Math.min(Math.floor(this.attack * (this.level * .4)), 50);
        let health = Math.min(Math.floor(this.health * (this.level * .4)), 50);
        let mantis = new PrayingMantis(this.logService, this.abilityService, this.parent, health, attack, 0, this.minExpForLevel, null);

        let result = this.parent.summonPetInFront(this, mantis);
        if (result.success) {
            this.logService.createLog(
                {
                    message:`${this.name} spawned Mantis ${mantis.attack}/${mantis.health}.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: result.randomEvent
                }
            )
            this.abilityService.triggerFriendSummonedEvents(mantis);
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