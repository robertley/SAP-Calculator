import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class GingerbreadManAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'GingerbreadManAbility',
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
        let expGain = 1 * multiplier;

        this.logService.createLog({
            message: `${owner.name} gained ${expGain} experience (Gingerbread Man)${this.equipment.multiplierMessage}.`,
            type: 'equipment',
            player: owner.parent
        });

        owner.increaseExp(expGain);
    }
}