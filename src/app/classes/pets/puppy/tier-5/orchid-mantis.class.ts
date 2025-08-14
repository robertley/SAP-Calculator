import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Mantis} from "../../hidden/mantis.class";

export class OrchidMantis extends Pet {
    name = "Orchid Mantis";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let attack =Math.min(Math.floor(this.attack * (this.level * .4)), 50);
        let health = Math.min(Math.floor(this.health * (this.level * .4)), 50);
        let mantis = new Mantis(this.logService, this.abilityService, this.parent, health, attack, 0, this.minExpForLevel, null);

        let message = `${this.name} spawned Mantis ${mantis.attack}/${mantis.health}.`;
        this.logService.createLog(
            {
                message: message,
                type: "ability",
                player: this.parent,
                tiger: tiger
            }
        )
        if (this.parent.summonPetInFront(this, mantis)) {
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