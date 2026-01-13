import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class CoconutCrabAbility extends Ability {
    private logService: LogService;
    private hasCoconut = false;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Coconut Crab Ability',
            owner: owner,
            triggers: ['Eat2', 'StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        if (context.trigger === 'StartTurn') {
            if (this.hasCoconut) {
                owner.removePerk(true);
                this.hasCoconut = false;
            }
            return;
        }

        if (context.trigger === 'Eat2') {
            const coconut = new Coconut();
            coconut.uses = this.level;
            coconut.originalUses = this.level;
            owner.givePetEquipment(coconut);
            this.hasCoconut = true;

            this.logService.createLog({
                message: `${owner.name} gained Coconut perk that works ${this.level === 1 ? 'once' : this.level === 2 ? 'twice' : 'thrice'} until next turn.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon
            });
            this.triggerTigerExecution(context);
        }
    }

    copy(newOwner: Pet): CoconutCrabAbility {
        return new CoconutCrabAbility(newOwner, this.logService);
    }
}
