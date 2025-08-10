import { Chili } from "app/classes/equipment/turtle/chili.class";
import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Bus } from "../../hidden/bus.class";

export class Deer extends Pet {
    name = "Deer";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    afterFaint(gameApi, tiger, pteranodon?: boolean) {
        let bus = new Bus(this.logService, this.abilityService, this.parent, null, null, null, this.minExpForLevel, new Chili(this.logService, this.abilityService));
        this.abilityService.setSpawnEvent({
            callback: () => {
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Bus level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(bus, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(bus);
                }
            },
            priority: this.attack
        })

        super.superAfterFaint(gameApi, tiger, pteranodon);
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
//Faint: Summon one 5/3 *level Bus with Chili.