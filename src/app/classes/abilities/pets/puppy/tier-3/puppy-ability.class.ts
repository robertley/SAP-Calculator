import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { InjectorService } from "app/services/injector.service";
import { ToyService } from "app/services/toy.service";
import { getRandomInt } from "app/util/helper-functions";
import { logAbility } from "../../../ability-helpers";

export class PuppyAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PuppyAbility',
            owner: owner,
            triggers: ['StartTurn'],
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
        const owner = this.owner;
        const toyService = InjectorService.getInjector().get(ToyService);
        const tier = Math.max(1, Math.min(3, this.level));
        const availableToys = toyService.toys.get(tier) ?? [];

        if (availableToys.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const toyName = availableToys[getRandomInt(0, availableToys.length - 1)];
        const newToy = toyService.createToy(toyName, owner.parent, tier);
        if (!newToy) {
            this.triggerTigerExecution(context);
            return;
        }

        owner.parent.toy = newToy;
        owner.parent.toy.used = false;
        owner.parent.toy.triggers = 0;

        logAbility(this.logService, owner, `${owner.name} chose a level ${tier} ${toyName} toy.`, context.tiger, context.pteranodon);
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PuppyAbility {
        return new PuppyAbility(newOwner, this.logService, this.abilityService);
    }
}
