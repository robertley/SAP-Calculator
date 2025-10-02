import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Melon } from "../../../../equipment/turtle/melon.class";

export class BrainCrampAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BrainCrampAbility',
            owner: owner,
            triggers: ['ClearFront'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context: AbilityContext) => {
                const owner = this.owner;
                // Check if first pet is null (front space is empty)
                return owner.parent.pet0 == null;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let power = this.level * 2;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} pushed ${target.name} to the front.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
        owner.parent.pushPetToFront(target, true);

        let melonTargetResp = owner.parent.getThis(owner);
        let melonTarget = melonTargetResp.pet;
        if (melonTarget == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${melonTarget.name} Melon.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
        melonTarget.givePetEquipment(new Melon());

        let buffTargetResp = owner.parent.getThis(owner);
        let buffTarget = buffTargetResp.pet;
        if (buffTarget == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${buffTarget.name} ${power} attack.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
        buffTarget.increaseAttack(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BrainCrampAbility {
        return new BrainCrampAbility(newOwner, this.logService);
    }
}