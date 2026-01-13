import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ChimpanzeeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Chimpanzee Ability',
            owner: owner,
            triggers: ['CornEatenByFriend'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const targetResp = owner.parent.getSpecificPet(owner, context.triggerPet);
        const target = targetResp.pet;
        if (!target) {
            this.triggerTigerExecution(context);
            return;
        }

        const buff = this.level;
        target.increaseAttack(buff);
        target.increaseHealth(buff);

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${buff}/+${buff} after eating Corncob.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon,
            randomEvent: targetResp.random
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ChimpanzeeAbility {
        return new ChimpanzeeAbility(newOwner, this.logService);
    }
}
