import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AardvarkAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Aardvark Ability',
            owner: owner,
            triggers: ['EnemySummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        const buff = 2 * this.level;
        owner.increaseAttack(buff);
        owner.increaseHealth(buff);

        this.logService.createLog({
            message: `${owner.name} gained +${buff}/+${buff} from EnemySummoned.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): AardvarkAbility {
        return new AardvarkAbility(newOwner, this.logService);
    }
}