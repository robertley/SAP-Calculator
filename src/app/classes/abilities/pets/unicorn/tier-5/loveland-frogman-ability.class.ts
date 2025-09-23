import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";

export class LovelandFrogmanAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LovelandFrogmanAbility',
            owner: owner,
            triggers: ['BeforeFriendAttacks'],
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
        let power: Power = {
            attack: owner.level * 1,
            health: owner.level * 2
        };
        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: owner.parent,
            randomEvent: targetResp.random
        });

        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LovelandFrogmanAbility {
        return new LovelandFrogmanAbility(newOwner, this.logService);
    }
}