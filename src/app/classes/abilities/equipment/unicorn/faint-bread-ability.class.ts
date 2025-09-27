import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { PetService } from "../../../../services/pet.service";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class FaintBreadAbility extends Ability {
    private equipment: Equipment;
    private petService: PetService;
    private logService: LogService;

    constructor(owner: Pet, equipment: Equipment, petService: PetService, logService: LogService) {
        super({
            name: 'FaintBreadAbility',
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
        this.petService = petService;
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            let faintPet = this.petService.getRandomFaintPet(owner.parent, 1);

            let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

            let summonResult = owner.parent.summonPet(faintPet, owner.savedPosition);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} Spawned ${faintPet.name} (Faint Bread)${multiplierMessage}`,
                    type: "ability",
                    player: owner.parent,
                    randomEvent: true
                });
            }
        }
    }
}