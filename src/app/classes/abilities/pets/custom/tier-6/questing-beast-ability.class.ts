import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { InjectorService } from "app/services/injector.service";
import { ToyService } from "app/services/toy/toy.service";
import { getRandomInt } from "app/util/helper-functions";

export class QuestingBeastAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'QuestingBeastAbility',
            owner: owner,
            triggers: ['ThisSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const level = Math.max(1, Math.min(3, this.level));
        const toyService = InjectorService.getInjector().get(ToyService);
        const availableToys = toyService.toys.get(level) ?? [];
        if (availableToys.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const toyName = availableToys[getRandomInt(0, availableToys.length - 1)];
        const newToy = toyService.createToy(toyName, owner.parent, level);
        if (!newToy) {
            this.triggerTigerExecution(context);
            return;
        }

        owner.parent.toy = newToy;
        owner.parent.toy.used = false;
        owner.parent.toy.triggers = 0;

        this.logService.createLog({
            message: `${owner.name} created a level ${level} ${toyName} toy.`,
            type: 'ability',
            player: owner.parent
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): QuestingBeastAbility {
        return new QuestingBeastAbility(newOwner, this.logService);
    }
}
