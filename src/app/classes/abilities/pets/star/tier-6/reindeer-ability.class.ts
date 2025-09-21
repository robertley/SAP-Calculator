import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Melon } from "../../../../equipment/turtle/melon.class";

export class ReindeerAbility extends Ability {
    private logService: LogService;
    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ReindeerAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
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
        target.givePetEquipment(new Melon());
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} Melon.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ReindeerAbility {
        return new ReindeerAbility(newOwner, this.logService);
    }
}