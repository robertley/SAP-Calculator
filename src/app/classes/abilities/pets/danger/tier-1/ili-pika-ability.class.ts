import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class IliPikaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'IliPikaAbility',
            owner: owner,
            triggers: ['FriendTransformed'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;

        if (!target) {
            return;
        }

        let power = this.level * 1;

        // Determine highest stat
        if (target.attack > target.health) {
            target.increaseAttack(power);
            this.logService.createLog({
                message: `${owner.name} give ${power} attack to ${target.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        } else {
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${owner.name} give ${power} health to ${target.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): IliPikaAbility {
        return new IliPikaAbility(newOwner, this.logService);
    }
}