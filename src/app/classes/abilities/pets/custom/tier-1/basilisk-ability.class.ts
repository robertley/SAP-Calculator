import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Rock } from "../../../../pets/hidden/rock.class";
import { AbilityService } from "app/services/ability/ability.service";

export class BasiliskAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'Basilisk Ability',
            owner: owner,
            triggers: ['StartBattle'],
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

        const friendAhead = owner.petAhead;

        if (friendAhead && friendAhead.alive) {
            const hpBonus = this.level * 5;
            const rock = new Rock(this.logService, this.abilityService, friendAhead.parent);
            rock.initPet(0, 1 + hpBonus, 0, 0, null);

            owner.parent.transformPet(friendAhead, rock);

            this.logService.createLog({
                message: `${owner.name} transformed ${friendAhead.name} into a Rock with +${hpBonus} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): BasiliskAbility {
        return new BasiliskAbility(newOwner, this.logService, this.abilityService);
    }
}
