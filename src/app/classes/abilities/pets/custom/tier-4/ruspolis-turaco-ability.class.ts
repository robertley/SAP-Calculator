import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class RuspolisTuracoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Ruspoli\'s Turaco Ability',
            owner: owner,
            triggers: ['StartBattle'],
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
        const manaGain = [4, 8, 12][Math.min(this.level - 1, 2)];

        const transformed: string[] = [];
        owner.parent.petArray.forEach((friend) => {
            if (!friend || !friend.alive || !friend.equipment) {
                return;
            }

            if (friend.equipment.name === 'Strawberry') {
                friend.removePerk();
                friend.increaseMana(manaGain);
                transformed.push(friend.name);
            }
        });

        if (transformed.length > 0) {
            this.logService.createLog({
                message: `${owner.name} replaced Strawberries on ${transformed.join(', ')} with +${manaGain} mana.`,
                type: 'ability',
                player: owner.parent,
                tiger,
                pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): RuspolisTuracoAbility {
        return new RuspolisTuracoAbility(newOwner, this.logService);
    }
}
