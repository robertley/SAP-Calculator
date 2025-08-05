import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Beaver } from "../../turtle/tier-1/beaver.class";
import { Duck } from "../../turtle/tier-1/duck.class";

export class Platypus extends Pet {
    name = "Platypus";
    tier = 4;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power = this.level * 3;
        let duck = new Duck(this.logService, this.abilityService, this.parent, power, power, 0, this.minExpForLevel);
        let beaver = new Beaver(this.logService, this.abilityService, this.parent, power, power, 0, this.minExpForLevel);
        this.abilityService.setSpawnEvent({
            callback: () => {
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${power}/${power} Duck level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(duck, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(duck);
                }
            },
            priority: this.attack
        })
        this.abilityService.setSpawnEvent({
            callback: () => {
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${power}/${power} Beaver level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(beaver, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(beaver);
                }
            },
            priority: this.attack
        })
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