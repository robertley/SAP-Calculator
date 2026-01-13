import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class KomodoAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'KomodoAbility',
            owner: owner,
            triggers: ['EndTurn'],
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
        const { gameApi, tiger, pteranodon } = context;
        const owner = this.owner;
        if (owner.position === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const targets = owner.getPetsAhead(owner.position, false);
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const buffAmount = this.level;
        for (const target of targets) {
            target.increaseAttack(buffAmount);
            target.increaseHealth(buffAmount);
        }

        if (gameApi) {
            gameApi.komodoShuffle = true;
        }

        const names = targets.map(p => p.name).join(", ");
        this.logService.createLog({
            message: `${owner.name} gave ${names} +${buffAmount}/+${buffAmount} at end of turn and shuffled positions.`,
            type: 'ability',
            player: owner.parent,
            tiger,
            pteranodon,
            randomEvent: true
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): KomodoAbility {
        return new KomodoAbility(newOwner, this.logService, this.abilityService);
    }
}
