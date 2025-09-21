import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Garlic } from "../../../../equipment/turtle/garlic.class";

export class BilbyAbility extends Ability {
    private logService: LogService;

    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BilbyAbility',
            owner: owner,
            triggers: ['FriendLostPerk'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return triggerPet && triggerPet !== owner;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} Garlic.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
        target.givePetEquipment(new Garlic());

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BilbyAbility {
        return new BilbyAbility(newOwner, this.logService);
    }
}