import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { Tandgnost } from "../../../pets/custom/tier-4/tandgnost.class";
import { Tandgrisner } from "../../../pets/custom/tier-5/tandgrisner.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { sum } from "lodash";

export class YggdrasilFruitAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'YggdrasilFruitAbility',
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
            let tandgnost = new Tandgnost(this.logService, this.abilityService, owner.parent, 3, 3, 0);
            let tandgrisner = new Tandgrisner(this.logService, this.abilityService, owner.parent, 3, 3, 0);

            let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

            let summonResult = owner.parent.summonPet(tandgnost, owner.savedPosition);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} Spawned Tandgnost (Yggdrasil Fruit)${multiplierMessage}`,
                    type: "ability",
                    player: owner.parent
                });
            }

            let summonResult2 = owner.parent.summonPet(tandgrisner, owner.savedPosition);
            if (summonResult2.success) {
                this.logService.createLog({
                    message: `${owner.name} Spawned Tandgrisner (Yggdrasil Fruit)${multiplierMessage}`,
                    type: "ability",
                    player: owner.parent
                });
            }
        }
    }
}