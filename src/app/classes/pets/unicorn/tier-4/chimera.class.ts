import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChimGoat } from "../../hidden/chim-goat.class";
import { ChimLion } from "../../hidden/chim-lion.class";
import { ChimSnake } from "../../hidden/chim-snake.class";

export class Chimera extends Pet {
    name = "Chimera";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana == 0) {
            return;
        }

        let power: Power = {
            attack: this.mana,
            health: this.mana * 2
        }

        this.logService.createLog(
            {
                message: `${this.name} spent ${this.mana} mana.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

        this.abilityService.setSpawnEvent({
            callback: () => {
                let lion = new ChimLion(this.logService, this.abilityService, this.parent, power.health, power.attack);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a ${lion.name} ${power.attack}/${power.health}.`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(lion, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(lion);
                }
            },
            priority: this.attack
        })

        if (this.level == 1) {
            this.mana = 0;
            return;
        }

        this.abilityService.setSpawnEvent({
            callback: () => {
                let goat = new ChimGoat(this.logService, this.abilityService, this.parent, power.health, power.attack);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a ${goat.name} ${power.attack}/${power.health}.`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(goat, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(goat);
                }
            },
            priority: this.attack - 1
        })

        if (this.level == 2) {
            this.mana = 0;
            return;
        }

        this.abilityService.setSpawnEvent({
            callback: () => {
                let snake = new ChimSnake(this.logService, this.abilityService, this.parent, power.health, power.attack);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a ${snake.name} ${power.attack}/${power.health}.`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(snake, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(snake);
                }
            },
            priority: this.attack - 2
        })

        this.mana = 0;
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