import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class PancakesAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'PancakesAbility',
            owner: owner,
            triggers: ['BeforeStartBattle'],
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

        for (let pett of owner.parent.petArray) {
            if (owner == pett) {
                continue;
            }
            let attackGain = 2 * this.equipment.multiplier;
            let healthGain = 2 * this.equipment.multiplier;
            pett.increaseAttack(attackGain);
            pett.increaseHealth(healthGain);
            this.logService.createLog({
                message: `${pett.name} gained ${attackGain} attack and ${healthGain} health (Pancakes)${this.equipment.multiplierMessage}`,
                type: 'equipment',
                player: owner.parent
            });
        }
    }
}