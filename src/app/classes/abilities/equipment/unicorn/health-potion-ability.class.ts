import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class HealthPotionAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'HealthPotionAbility',
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

        let multiplier = this.equipment.multiplier;
        let power = 2 * multiplier;
        let target = owner.parent.furthestUpPet;

        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${power} health to ${target.name} (Health Potion)${this.equipment.multiplierMessage}.`,
            type: 'equipment',
            player: owner.parent
        });

        target.increaseHealth(power);
    }
}