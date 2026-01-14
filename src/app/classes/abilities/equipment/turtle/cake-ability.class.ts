import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { Equipment } from "../../../equipment.class";

export class CakeAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: "CakeAbility",
            owner: owner,
            triggers: ["EndTurn"],
            abilityType: "Equipment",
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
        const amount = 1 * (this.equipment.multiplier ?? 1);
        owner.increaseSellValue(amount);
        this.logService.createLog({
            message: `${owner.name} increased its sell value by ${amount}. (Cake)${this.equipment.multiplierMessage}`,
            type: "equipment",
            player: owner.parent
        });
    }
}
