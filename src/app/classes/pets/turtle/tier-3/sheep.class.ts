import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ram } from "../../hidden/ram.class";

export class Sheep extends Pet {
    name = "Sheep";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    faint(gameApi, tiger, pteranodon?: boolean) {

        for (let i = 0; i < 2; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let ram = new Ram(this.logService, this.abilityService, this.parent, null, null, 0, this.minExpForLevel);
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned Ram (${ram.attack}/${ram.health}).`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger,
                            pteranodon: pteranodon
                        }
                    )

                    if (this.parent.summonPet(ram, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(ram);
                    }
                },
                priority: this.attack
            })
        }

        super.superFaint(gameApi, tiger);
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