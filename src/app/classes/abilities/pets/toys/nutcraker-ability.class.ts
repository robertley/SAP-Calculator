import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { SalmonOfKnowledge } from "../../../pets/unicorn/tier-5/salmon-of-knowledge.class";

export class NutcrakerAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private used: boolean = false;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'NutcrakerAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Nutcracker toy behavior (friendFaints method)
        if (this.used) {
            this.triggerTigerExecution(context);
            return;
        }
        let pets = owner.parent.petArray.filter(p => p.alive);
        if (pets.length > 0) {
            this.triggerTigerExecution(context);
            return;
        }

        let power = this.level * 6;
        let salmon = new SalmonOfKnowledge(this.logService, this.abilityService, owner.parent, power, power, null, 0);

        if (owner.parent.summonPet(salmon, 0).success) {
            this.logService.createLog(
                {
                    message: `Nutcraker Ability spawned Salmon of Knowledge (${power}/${power})`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                }
            )        
        }

        this.used = true;

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): NutcrakerAbility {
        return new NutcrakerAbility(newOwner, this.logService, this.abilityService);
    }
}