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
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        } 
        if (pet instanceof ZombieFly) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let zombie = new ZombieFly(this.logService, this.abilityService, this.parent, null, null, null, this.minExpForLevel);

        let summonResult = this.parent.summonPet(zombie, pet.savedPosition, true, this);
        
        if (summonResult.success) {
            this.abilityUses++;
            this.logService.createLog(
                {
                    message: `${this.name} spawned Zombie Fly Level ${this.level}`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: summonResult.randomEvent
                }
            )
            this.abilityService.triggerFriendSummonedEvents(zombie);
        }

        super.superFriendFaints(gameApi, pet, tiger);
    }
    setAbilityUses() {
        super.setAbilityUses();
        this.maxAbilityUses = 3;
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