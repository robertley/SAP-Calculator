import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class CassowaryAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CassowaryAbility',
            owner: owner,
            triggers: ['FriendGainsPerk'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return triggerPet && triggerPet.equipment?.name === 'Strawberry';
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        const buffAmount = this.level;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${buffAmount} permanent health and +${buffAmount} attack for this battle.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        target.increaseHealth(buffAmount);
        target.increaseAttack(buffAmount);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): CassowaryAbility {
        return new CassowaryAbility(newOwner, this.logService);
    }
}