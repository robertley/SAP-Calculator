import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class MildChiliAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'MildChiliAbility',
            owner: owner,
            triggers: ['ThisAttacked'],
            abilityType: 'Equipment',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const opponent = owner.parent.opponent;
        if (!opponent) {
            return;
        }
        // target the second enemy (index 1) if present
        const targets = opponent.petArray.filter(p => p.alive);
        if (targets.length < 2) {
            return;
        }
        const target = targets[1];
        if (!target) {
            return;
        }
        const damage = 4 * (this.equipment?.multiplier || 1);
        owner.dealDamage(target, damage);
        this.logService.createLog({ message: `${owner.name} dealt ${damage} damage to ${target.name} (Mild Chili)`, type: 'ability', player: owner.parent });
    }
}
