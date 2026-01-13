import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BrazillianTreehopperAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Brazillian Treehopper Ability',
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
        const opponent = owner.parent.opponent;

        const targetCount = 2 * this.level;
        const targetsResp = opponent.getRandomPets(targetCount, [], false, false, owner);
        const targets = targetsResp.pets;

        if (targets.length > 1) {
            let totalAttack = 0;
            let totalHealth = 0;
            for (const target of targets) {
                totalAttack += target.attack;
                totalHealth += target.health;
            }

            const avgAttack = Math.floor(totalAttack / targets.length);
            const avgHealth = Math.floor(totalHealth / targets.length);

            for (const target of targets) {
                target.attack = Math.max(1, avgAttack);
                target.health = Math.max(1, avgHealth);
            }

            this.logService.createLog({
                message: `${owner.name} averaged stats of ${targets.length} enemies to ${avgAttack}/${avgHealth}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): BrazillianTreehopperAbility {
        return new BrazillianTreehopperAbility(newOwner, this.logService);
    }
}
