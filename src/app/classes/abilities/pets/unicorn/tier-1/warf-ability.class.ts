import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WarfAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WarfAbility',
            owner: owner,
            triggers: ['ThisGainedMana'],
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

        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let targetResp = owner.parent.opponent.getRandomPet([], false, true, false, owner);

        if (targetResp.pet == null) {
            return;
        }

        owner.snipePet(targetResp.pet, this.level, targetResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WarfAbility {
        return new WarfAbility(newOwner, this.logService);
    }
}