import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class PitaBreadAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'PitaBreadAbility',
            owner: owner,
            triggers: ['ThisHurt'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Pita Bread is removed after one use
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

        if (!owner.alive) {
            return;
        }

        let multiplier = this.equipment.multiplier;
        let power = 15 * multiplier;
        owner.increaseHealth(power);

        let message = `${owner.name} gained ${power} health. (Pita Bread)${this.equipment.multiplierMessage}`;

        this.logService.createLog({
            message: message,
            type: 'equipment',
            player: owner.parent
        });

        owner.removePerk();
    }
}