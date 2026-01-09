import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class NudibranchAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'NudibranchAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context: AbilityContext) => {
                const owner = this.owner;
                let petSet: Set<string> = new Set();
                for (const pet of owner.parent.petArray) {
                    if (petSet.has(pet.name)) {
                        return false;
                    }
                    petSet.add(pet.name);
                }
                return true;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        const attackGain = this.level * 3;
        const healthGain = this.level;
        owner.increaseAttack(attackGain);
        owner.increaseHealth(healthGain);

        this.logService.createLog({
            message: `${owner.name} gained +${attackGain} attack and +${healthGain} health.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): NudibranchAbility {
        return new NudibranchAbility(newOwner, this.logService);
    }
}
