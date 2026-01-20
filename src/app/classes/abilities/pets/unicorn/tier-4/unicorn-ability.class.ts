import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { words } from "lodash-es";

export class UnicornAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'UnicornAbility',
            owner: owner,
            triggers: ['FriendGainsAilment'],
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
        let power = this.level * 2;
        if (!triggerPet) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} removed ailment from ${triggerPet.name}.`,
            type: 'ability',
            player: owner.parent
        });
        triggerPet.removePerk();

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            randomEvent: targetResp.random
        });

        target.increaseAttack(power);
        target.increaseHealth(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): UnicornAbility {
        return new UnicornAbility(newOwner, this.logService);
    }
}