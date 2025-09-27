import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Weak } from "../../../../equipment/ailments/weak.class";

export class BatAbility extends Ability {
    private logService: LogService;

    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BatAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let excludePets = owner.parent.opponent.getPetsWithEquipment('Weak');
        let targetsResp = owner.parent.opponent.getRandomPet(excludePets, null, true, null, owner);
        let target = targetsResp.pet;
        if (target != null) {
            target.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${owner.name} made ${target.name} weak.`,
                type: 'ability',
                player: owner.parent,
                randomEvent: targetsResp.random,
                tiger: tiger
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BatAbility {
        return new BatAbility(newOwner, this.logService);
    }
}