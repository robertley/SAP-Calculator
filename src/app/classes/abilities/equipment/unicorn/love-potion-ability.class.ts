import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class LovePotionAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'LovePotionAbility',
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

        let petAhead = owner.petAhead;
        if (petAhead == null) {
            return;
        }

        let multiplier = this.equipment.multiplier;
        let power = 2 * multiplier;

        this.logService.createLog({
            message: `${owner.name} gave ${petAhead.name} ${power} health (Love Potion)${this.equipment.multiplierMessage}.`,
            type: 'equipment',
            player: owner.parent
        });

        petAhead.increaseHealth(power);
    }
}