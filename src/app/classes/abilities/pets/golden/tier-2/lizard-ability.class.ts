import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { LizardTail } from "app/classes/pets/hidden/lizard-tail.class";

export class LizardAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'LizardAbility',
            owner: owner,
            triggers: ['ThisHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let lizardTail = new LizardTail(this.logService, this.abilityService, owner.parent, null, null, 0, owner.minExpForLevel);

        let summonResult = owner.parent.summonPetInFront(owner, lizardTail);

        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned Lizard Tail Level ${owner.level}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: summonResult.randomEvent
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LizardAbility {
        return new LizardAbility(newOwner, this.logService, this.abilityService);
    }
}