import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class RambutanAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'RambutanAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
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

        let baseManaGain = 3;
        let multiplier = this.equipment.multiplier;
        let manaGain = baseManaGain * multiplier;

        this.logService.createLog({
            message: `${owner.name} gained ${manaGain} mana. (Rambutan)${this.equipment.multiplierMessage}`,
            type: 'equipment',
            player: owner.parent
        });

        owner.increaseMana(manaGain);
    }
}