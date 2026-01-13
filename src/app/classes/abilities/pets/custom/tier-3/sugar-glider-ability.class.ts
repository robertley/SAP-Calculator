import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { shuffle } from "app/util/helper-functions";

export class SugarGliderAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Sugar Glider Ability',
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
        const manaBuff = 2 * this.level;

        const friends = shuffle(owner.parent.petArray.filter(p => p.alive && p !== owner));
        const targets = friends.slice(0, 2);

        for (const target of targets) {
            target.mana += manaBuff;
        }

        if (targets.length > 0) {
            this.logService.createLog({
                message: `${owner.name} gave ${manaBuff} mana to ${targets.length} friends.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): SugarGliderAbility {
        return new SugarGliderAbility(newOwner, this.logService);
    }
}
