import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class CyclopsAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CyclopsAbility',
            owner: owner,
            triggers: ['FriendLeveledUp'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let manaGain = this.level * 2;
        let manaTargetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let manaTarget = manaTargetResp.pet;
        if (manaTarget == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${manaTarget.name} ${manaGain} mana.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: manaTargetResp.random
        });
        manaTarget.increaseMana(manaGain);

        if (this.currentUses > this.level) {
            this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
            return;
        }

        let expTargetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let expTarget = expTargetResp.pet;
        this.logService.createLog({
            message: `${owner.name} gave ${expTarget.name} 1 exp.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: expTargetResp.random
        });

        expTarget.increaseExp(1);
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): CyclopsAbility {
        return new CyclopsAbility(newOwner, this.logService);
    }
}