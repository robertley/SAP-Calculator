import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class VervetAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Vervet Ability',
            owner: owner,
            triggers: ['ThisBought'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi } = context;
        const owner = this.owner;
        const level = this.level;

        const toyName = 'Microwave Oven';
        const toy = (gameApi as any).toyService.createToy(toyName, owner.parent, level);

        if (toy) {
            owner.parent.toy = toy;

            this.logService.createLog({
                message: `${owner.name} was bought and summoned a level ${level} ${toyName}.`,
                type: 'ability',
                player: owner.parent
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): VervetAbility {
        return new VervetAbility(newOwner, this.logService);
    }
}
