import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";

export class MicrowaveOvenAbility extends Ability {
    constructor(owner: Pet, logService: LogService, equipmentService: EquipmentService) {
        super({
            name: 'MicrowaveOvenAbility',
            triggers: ['StartBattle'],
            owner: owner,
            abilityType: 'Pet',
            abilityFunction: (context: AbilityContext) => {
                const { puma } = context;
                let excludePets = owner.parent.getPetsWithEquipment('Popcorn');
                let targetResp = owner.parent.getFurthestUpPets(this.abilityLevel, excludePets);
                let targets = targetResp.pets;
                if (targets.length == 0) {
                    return;
                }

                for (let pet of targets) {
                    logService.createLog({
                        message: `${owner.name} gave ${pet.name} Popcorn (Microwave Oven).`,
                        type: 'ability',
                        player: owner.parent,
                        puma: puma
                    })
                    const popcorn = equipmentService.getInstanceOfAllEquipment().get('Popcorn');
                    pet.givePetEquipment(popcorn);
                }
            }
        });
    }
}
