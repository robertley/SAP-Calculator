import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ZombieFly } from "../../hidden/zombie-fly.class";

export class Fly extends Pet {
    name = "Fly";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 5;
    health = 5;
    flyCounter = 0;
    friendFaints(gameApi: GameAPI, tiger?: boolean, faintedPet?: Pet): void {
        if (faintedPet instanceof ZombieFly) {
            return;
        }
        if (this.flyCounter > 2) {
            return;
        }
        this.abilityService.setSpawnEvent({
            callback: () => {
                let zombie = new ZombieFly(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Zombie Fly Level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger
                    }
                )

                if (this.parent.summonPet(zombie, faintedPet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(zombie);
                }
            },
            priority: this.attack
        })
        this.flyCounter++;
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

    resetPet(): void {
        super.resetPet();
        this.flyCounter = 0;
    }
}