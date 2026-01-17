import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";
import { InjectorService } from "app/services/injector.service";
import { getRandomInt } from "app/util/helper-functions";
import { canApplyAilment, logAbility } from "../../../ability-helpers";

export class LeafGeckoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Leaf Gecko Ability',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const equipmentService = InjectorService.getInjector().get(EquipmentService);
        const ailmentNames = Array.from(equipmentService.getInstanceOfAllAilments().keys());
        const targets = [...owner.parent.petArray, ...owner.parent.opponent.petArray].filter((pet) => pet?.alive);

        if (ailmentNames.length === 0 || targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const requiredCount = this.level * 3;
        let appliedCount = 0;
        let attempts = 0;
        const maxAttempts = requiredCount * 5;

        while (appliedCount < requiredCount && attempts < maxAttempts) {
            const target = targets[getRandomInt(0, targets.length - 1)];
            const ailmentName = ailmentNames[getRandomInt(0, ailmentNames.length - 1)];
            if (!target || !canApplyAilment(target, ailmentName)) {
                attempts++;
                continue;
            }

            const ailmentInstance = equipmentService.getInstanceOfAllAilments().get(ailmentName);
            if (!ailmentInstance) {
                attempts++;
                continue;
            }

            target.givePetEquipment(ailmentInstance);
            appliedCount++;
            attempts++;
        }

        const message = appliedCount > 0
            ? `${owner.name} cursed ${appliedCount} pet${appliedCount === 1 ? '' : 's'} with random ailments.`
            : `${owner.name} could not apply any random ailments.`;

        logAbility(this.logService, owner, message, tiger, pteranodon);
        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): LeafGeckoAbility {
        return new LeafGeckoAbility(newOwner, this.logService);
    }
}
