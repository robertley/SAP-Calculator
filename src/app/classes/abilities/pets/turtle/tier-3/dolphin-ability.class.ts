import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DolphinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DolphinAbility',
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
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let opponent = owner.parent.opponent;

        for (let i = 0; i < this.level; i++) {
            let lowestHealthResp = opponent.getLowestHealthPet(null, owner);
            if (!lowestHealthResp.pet) {
                break;
            }
            owner.snipePet(lowestHealthResp.pet, 4, lowestHealthResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DolphinAbility {
        return new DolphinAbility(newOwner, this.logService);
    }
}