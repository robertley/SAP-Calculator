import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { Monty } from "../../../pets/hidden/monty.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class EasterEggAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'EasterEggAbility',
            owner: owner,
            triggers: ['ThisDied'],
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

        for (let i = 0; i < this.equipment.multiplier; i++) {
            let monty = new Monty(this.logService, this.abilityService, owner.parent, null, null, 0, 0);

            let summonResult = owner.parent.summonPet(monty, owner.savedPosition);
            if (summonResult.success) {
                let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

                this.logService.createLog({
                    message: `${owner.name} Spawned Monty (Easter Egg)${multiplierMessage}`,
                    type: "ability",
                    player: owner.parent
                });
            }
        }
    }
}