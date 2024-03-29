import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { ToyService } from "../../../services/toy.service";
import { GreatOne } from "../../pets/custom/tier-6/great-one.class";
import { Toy } from "../../toy.class";

export class EvilBook extends Toy {
    name = "Evil Book";
    tier = 5;
    emptyFromSpace(gameApi?: GameAPI, puma?: boolean, level?: number, priority?: number) {
        let power = {
            attack: level * 6,
            health: level * 6,
        };
        let exp = level == 1 ? 0 : level == 2 ? 2 : 5;
        this.abilityService.setSpawnEvent({
            callback: () => {
                let greatOne = new GreatOne(this.logService, this.abilityService, this.parent, power.health, power.attack, 0, exp);
                let message = `${this.name} spawned Great One (${power.attack}/${power.health}).`;
                this.logService.createLog(
                    {
                        message: message,
                        type: "ability",
                        player: this.parent,
                        puma: puma
                    }
                )

                if (this.parent.summonPet(greatOne, 0)) {
                    this.abilityService.triggerSummonedEvents(greatOne);
                }
            },
            priority: priority
        })
        this.used = true;

    }
    constructor(protected logService: LogService, protected toyService: ToyService, protected abilityService: AbilityService, parent, level) {
        super(logService, toyService, parent, level);
    }
}