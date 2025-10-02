import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class MushroomAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, petService: PetService) {
        super({
            name: 'MushroomAbility',
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
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            let newPet = this.petService.createDefaultVersionOfPet(owner, 1, 1);

            let summonResult = owner.parent.summonPet(newPet, owner.savedPosition);
            if (summonResult.success) {
                let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

                this.logService.createLog(
                    {
                        message: `${owner.name} Spawned ${newPet.name} (level ${newPet.level}) (Mushroom)${multiplierMessage}`,
                        type: "ability",
                        player: owner.parent
                    }
                )
            }
        }
    }
}