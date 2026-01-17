import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { Monkey } from "../../../pets/turtle/tier-5/monkey.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class BananaAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'BananaAbility',
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
            let monke = new Monkey(this.logService, this.abilityService, owner.parent, 4, 4, 0, 0);

            let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

            let summonResult = owner.parent.summonPet(monke, owner.savedPosition);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} Spawned Monkey (Banana)${multiplierMessage}`,
                    type: "ability",
                    player: owner.parent
                });            }
        }
    }
}