import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { ToyService } from "../../../services/toy.service";
import { Pet } from "../../pet.class";
import { SalmonOfKnowledge } from "../../pets/unicorn/tier-5/salmon-of-knowledge.class";
import { Player } from "../../player.class";
import { Toy } from "../../toy.class";

export class Nutcracker extends Toy {
    name = "Nutcracker";
    tier = 4;
    friendFaints(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
        if (this.used) {
            return;
        }
        let pets = pet.parent.petArray.filter(p => p.alive);
        if (pets.length > 0) {
            return;
        }

        this.abilityService.setSpawnEvent({
            callback: () => {
                let power = this.level * 6;
                let salmon = new SalmonOfKnowledge(this.logService, this.abilityService, this.parent, power, power, null, 0);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Salmon of Knowledge (${power}/${power})`,
                        type: "ability",
                        player: this.parent
                    }
                )

                if (this.parent.summonPet(salmon, 0)) {
                    this.abilityService.triggerSummonedEvents(salmon);
                }
            },
            priority: 100
        })

        this.used = true;

    }

    constructor(protected logService: LogService, protected toyService: ToyService, protected abilityService: AbilityService, parent: Player, level: number) {
        super(logService, toyService, parent, level);
    }
}