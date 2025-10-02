import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Melon } from "../../../../equipment/turtle/melon.class";

export class OxAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'OxAbility',
            owner: owner,
            triggers: ['FriendAheadDied'],
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

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        target.increaseAttack(1);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +1 attack.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        let melonTargetResp = owner.parent.getThis(owner);
        let melonTarget = melonTargetResp.pet;
        if (melonTarget == null) {
            return;
        }

        melonTarget.givePetEquipment(new Melon());
        this.logService.createLog({
            message: `${owner.name} gave ${melonTarget.name} Melon.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: melonTargetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }
    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }
    copy(newOwner: Pet): OxAbility {
        return new OxAbility(newOwner, this.logService);
    }
}