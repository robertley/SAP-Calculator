import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Spooked } from "../../../../equipment/ailments/spooked.class";

export class AmalgamationAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmalgamationAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        if (!triggerPet) {
            return;
        }

        let targetResp = owner.parent.getThis(triggerPet);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        let attackAmount = this.level * 3;
        let manaAmount = this.level * 4;

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${attackAmount} attack, +${manaAmount} mana, and Spooked.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.increaseAttack(attackAmount);
        target.increaseMana(manaAmount);
        target.givePetEquipment(new Spooked());

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AmalgamationAbility {
        return new AmalgamationAbility(newOwner, this.logService);
    }
}