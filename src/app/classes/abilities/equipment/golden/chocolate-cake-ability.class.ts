import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class ChocolateCakeAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'ChocolateCakeAbility',
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
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        let multiplier = this.equipment.multiplier;
        let expGain = 3 * multiplier;

        this.logService.createLog({
            message: `${owner.name} gained ${expGain} exp. (Chocolate Cake)${this.equipment.multiplierMessage}`,
            type: 'equipment',
            player: owner.parent
        });

        owner.increaseExp(expGain);
        owner.health = 0;

        this.abilityService.triggerKillEvents(owner, owner);
    }
}