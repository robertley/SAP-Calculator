import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Nest } from "../../../../pets/hidden/nest.class";
import { Egg } from "../../../../equipment/puppy/egg.class";

export class RobinAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'RobinAbility',
            owner: owner,
            triggers: ['StartBattle'],
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
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let nest = new Nest(this.logService, this.abilityService, owner.parent, null, null, this.minExpForLevel, null);
        this.logService.createLog({
            message: `${owner.name} summoned a Nest (level ${this.level}).`,
            type: 'ability',
            player: owner.parent,
            randomEvent: false,
            tiger: tiger
        });
        let result = owner.parent.summonPetInFront(owner, nest);
        if (result.success) {
            this.logService.createLog({
                message: `${owner.name} gave Nest an Egg.`,
                type: 'ability',
                player: owner.parent,
                randomEvent: result.randomEvent,
                tiger: tiger
            });

            nest.givePetEquipment(new Egg(this.logService));
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RobinAbility {
        return new RobinAbility(newOwner, this.logService, this.abilityService);
    }
}