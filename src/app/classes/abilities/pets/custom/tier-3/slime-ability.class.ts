import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { SmallerSlime } from "../../../../pets/hidden/smaller-slime.class";

export class SlimeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Slime Ability',
            owner: owner,
            triggers: ['ThisDied'],
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
        const battles = Math.max(0, owner.battlesFought ?? 0);
        const slimesToSpawn = Math.floor(battles / 2);

        if (slimesToSpawn <= 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const stats = 2 * this.level;
        let summoned = 0;

        for (let i = 0; i < slimesToSpawn; i++) {
            const slime = new SmallerSlime(this.logService, (owner as any).abilityService, owner.parent, stats, stats);
            const summonResult = owner.parent.summonPet(slime, owner.position);

            if (summonResult.success) {
                summoned++;
            } else {
                break;
            }
        }

        if (summoned > 0) {
            this.logService.createLog({
                message: `${owner.name} summoned ${summoned} ${stats}/${stats} Smaller Slime${summoned === 1 ? '' : 's'}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): SlimeAbility {
        return new SlimeAbility(newOwner, this.logService);
    }
}
