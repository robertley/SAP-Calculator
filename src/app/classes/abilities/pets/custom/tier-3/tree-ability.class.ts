import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class TreeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Tree Ability',
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
        const thresholds = [6, 12, 18];
        const threshold = thresholds[Math.min(this.level - 1, thresholds.length - 1)];

        if (owner.attack <= threshold) {
            owner.givePetEquipment(new Coconut());
            this.logService.createLog({
                message: `${owner.name} gained Coconut perk for meeting the ${threshold} attack threshold.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): TreeAbility {
        return new TreeAbility(newOwner, this.logService);
    }
}
