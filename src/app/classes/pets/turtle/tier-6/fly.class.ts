import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ZombieFly } from "../../hidden/zombie-fly.class";
import { cloneDeep } from "lodash";

export class Fly extends Pet {
    name = "Fly";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 5;
    health = 5;
    maxAbilityUses: number = 3;
    friendFaints(gameApi: GameAPI, faintedPet?: Pet, tiger?: boolean): void {
        if (faintedPet instanceof ZombieFly) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (!this.alive) {
            return;
        }

        let zombie = new ZombieFly(this.logService, this.abilityService, this.parent, null, null, null, this.minExpForLevel);

        if (this.parent.summonPet(zombie, faintedPet.savedPosition, true)) {
            this.abilityUses++;
            this.logService.createLog(
                {
                    message: `${this.name} spawned Zombie Fly Level ${this.level}`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger
                }
            )
            this.abilityService.triggerFriendSummonedEvents(zombie);
        }

        super.superFriendFaints(gameApi, faintedPet, tiger);
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