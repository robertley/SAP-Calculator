import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Quail } from "../../../../pets/hidden/quail.class";
import { AbilityService } from "app/services/ability/ability.service";

export class QuailChickAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'Quail Chick Ability',
            owner: owner,
            triggers: ['FoodEatenByThis'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const buffAmount = 2 * this.level;
        const frontFriend = owner.petAhead;

        if (frontFriend && frontFriend.alive) {
            frontFriend.increaseAttack(buffAmount);
            frontFriend.increaseHealth(buffAmount);
        }

        const quail = new Quail(
            this.logService,
            this.abilityService,
            owner.parent,
            undefined,
            undefined,
            undefined,
            owner.exp
        );

        owner.parent.transformPet(owner, quail);

        if (frontFriend && frontFriend.alive) {
            this.logService.createLog({
                message: `${owner.name} transformed into ${quail.name} and gave ${frontFriend.name} +${buffAmount} attack and +${buffAmount} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }
        else {
            this.logService.createLog({
                message: `${owner.name} transformed into ${quail.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): QuailChickAbility {
        return new QuailChickAbility(newOwner, this.logService, this.abilityService);
    }
}
