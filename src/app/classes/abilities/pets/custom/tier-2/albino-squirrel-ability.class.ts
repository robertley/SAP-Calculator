import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";
import { InjectorService } from "app/services/injector.service";
import { getRandomInt } from "app/util/helper-functions";

export class AlbinoSquirrelAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AlbinoSquirrelAbility',
            owner: owner,
            triggers: ['ThisSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        const equipmentService = InjectorService.getInjector().get(EquipmentService);
        const equipmentMap = equipmentService.getInstanceOfAllEquipment();
        const shopFoods = Array.from(equipmentMap.values()).filter((equipment) => equipment.equipmentClass === 'shop');

        if (shopFoods.length === 0) {
            return;
        }

        let chosenFoods: string[] = [];
        for (let i = 0; i < 3; i++) {
            let food = shopFoods[getRandomInt(0, shopFoods.length - 1)];
            chosenFoods.push(food.name);
        }

        this.logService.createLog({
            message: `${owner.name} restocked shop food with ${chosenFoods.join(', ')} at -${this.level} gold.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: true
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AlbinoSquirrelAbility {
        return new AlbinoSquirrelAbility(newOwner, this.logService);
    }
}
