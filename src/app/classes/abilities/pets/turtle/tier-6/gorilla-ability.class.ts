import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class GorillaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GorillaAbility',
            owner: owner,
            triggers: ['ThisHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return owner.alive;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        target.givePetEquipment(new Coconut());
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} a Coconut.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GorillaAbility {
        const newAbility = new GorillaAbility(newOwner, this.logService);
        // Update maxUses based on new owner's level
        newAbility.maxUses = newOwner.level;
        return newAbility;
    }
}