import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { MelonSlice } from "../../../../equipment/custom/melon-slice.class";

export class YetiCrabAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Yeti Crab Ability',
            owner: owner,
            triggers: ['PetLostPerk'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const triggerPet = context.triggerPet;
        const { tiger, pteranodon } = context;

        if (!triggerPet) {
            return;
        }

        if (triggerPet.parent === owner.parent) {
            const targetResp = owner.parent.getSpecificPet(owner, triggerPet);
            const melon = new MelonSlice();
            triggerPet.givePetEquipment(melon);
            this.logService.createLog({
                message: `${owner.name} gave ${triggerPet.name} a Melon Slice after losing a perk.`,
                type: 'ability',
                player: owner.parent,
                tiger,
                randomEvent: targetResp.random
            });
        } else {
            owner.dealDamage(triggerPet, 6);
            this.logService.createLog({
                message: `${owner.name} dealt 6 damage to ${triggerPet.name} after they lost a perk.`,
                type: 'ability',
                player: owner.parent,
                tiger,
                pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): YetiCrabAbility {
        return new YetiCrabAbility(newOwner, this.logService);
    }
}
